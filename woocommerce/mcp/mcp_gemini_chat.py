#!/usr/bin/env python3
"""
Cliente MCP para WooCommerce usando Gemini
Conecta a un servidor MCP y usa Gemini para procesar queries con las herramientas disponibles
"""

import os
import sys
import asyncio
from typing import Optional
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

import google.generativeai as genai
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configurar la API de Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class MCPGeminiClient:
    """Cliente MCP que utiliza Gemini para procesar queries"""
    
    def __init__(self):
        """Inicializa el cliente MCP con Gemini"""
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
        self.gemini_model = genai.GenerativeModel(
            os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        )
    
    async def connect_to_server(self, server_script_path: str):
        """
        Conecta al servidor MCP
        
        Args:
            server_script_path: Ruta al script del servidor (.py o .js)
        """
        is_python = server_script_path.endswith('.py')
        is_js = server_script_path.endswith('.js')
        
        if not (is_python or is_js):
            raise ValueError("El script del servidor debe ser .py o .js")
        
        command = "python" if is_python else "node"
        server_params = StdioServerParameters(
            command=command,
            args=[server_script_path],
            env=None
        )
        
        # Establecer conexión con el servidor
        stdio_transport = await self.exit_stack.enter_async_context(
            stdio_client(server_params)
        )
        self.stdio, self.write = stdio_transport
        self.session = await self.exit_stack.enter_async_context(
            ClientSession(self.stdio, self.write)
        )
        
        # Inicializar sesión
        await self.session.initialize()
        
        # Listar herramientas disponibles
        response = await self.session.list_tools()
        tools = response.tools
        print("\n✓ Conectado al servidor MCP")
        print(f"✓ Herramientas disponibles: {[tool.name for tool in tools]}\n")
    
    async def process_query(self, query: str) -> str:
        """
        Procesa una query usando Gemini y las herramientas MCP disponibles
        
        Args:
            query: La consulta del usuario
            
        Returns:
            Respuesta final procesada
        """
        import json
        import re
        
        # Obtener herramientas disponibles
        response = await self.session.list_tools()
        available_tools = response.tools
        
        # Crear descripción de herramientas para Gemini
        tools_description = self._format_tools_for_gemini(available_tools)
        
        # Crear el prompt inicial para Gemini
        initial_prompt = f"""Eres un asistente especializado en WooCommerce. Tienes acceso a las siguientes herramientas para consultar datos:

{tools_description}

Analiza la consulta del usuario y determina si necesitas usar alguna herramienta.

Si necesitas usar una herramienta, responde SOLO con un objeto JSON en este formato exacto:
{{"tool": "nombre_herramienta", "arguments": {{"param1": "valor1"}}}}

Si NO necesitas usar ninguna herramienta (por ejemplo, preguntas generales que no requieren datos de WooCommerce), responde directamente la pregunta.

Ejemplos:
- "¿Cuál es el producto más caro?" -> {{"tool": "list_products", "arguments": {{"per_page": 100}}}}
- "¿Cuántos pedidos pendientes tengo?" -> {{"tool": "list_orders", "arguments": {{"status": "pending"}}}}
- "¿Qué es WooCommerce?" -> Respuesta directa sin JSON

Consulta del usuario: {query}

Tu respuesta:"""
        
        # Llamada inicial a Gemini
        response = self.gemini_model.generate_content(initial_prompt)
        response_text = response.text.strip()
        
        # Limpiar el response_text de markdown code blocks si existen
        response_text = re.sub(r'^```json\s*', '', response_text)
        response_text = re.sub(r'\s*```$', '', response_text)
        response_text = response_text.strip()
        
        # Verificar si Gemini quiere usar una herramienta
        if response_text.startswith("{") and "tool" in response_text:
            try:
                tool_call = json.loads(response_text)
                tool_name = tool_call["tool"]
                tool_args = tool_call.get("arguments", {})
                
                print(f"🔧 Usando herramienta: {tool_name}")
                print(f"📋 Argumentos: {tool_args}\n")
                
                # Ejecutar la herramienta
                result = await self.session.call_tool(tool_name, tool_args)
                
                # Extraer el contenido del resultado
                tool_result = ""
                for content in result.content:
                    if hasattr(content, 'text'):
                        tool_result += content.text
                
                print(f"📊 Datos obtenidos:\n{tool_result[:500]}...\n")
                
                # Generar respuesta final con el resultado de la herramienta
                final_prompt = f"""Basándote ÚNICAMENTE en los siguientes datos obtenidos de WooCommerce, responde la consulta del usuario de forma clara, precisa y concisa.

Consulta original: {query}

Datos obtenidos de WooCommerce:
{tool_result}

Instrucciones:
- Si la pregunta es sobre el producto más caro, busca el precio más alto en los datos
- Si la pregunta es sobre cantidad, cuenta los elementos
- Si la pregunta es sobre detalles específicos, extrae la información relevante
- Sé directo y preciso en tu respuesta

Respuesta:"""
                
                final_response = self.gemini_model.generate_content(final_prompt)
                return final_response.text
                
            except json.JSONDecodeError as e:
                # Si no es JSON válido, probablemente es una respuesta directa
                print(f"⚠️  No se pudo parsear como JSON, tratando como respuesta directa")
                return response_text
            except Exception as e:
                return f"❌ Error al ejecutar la herramienta: {str(e)}"
        else:
            # Respuesta directa sin usar herramientas
            return response_text
    
    def _format_tools_for_gemini(self, tools) -> str:
        """Formatea las herramientas en un formato legible para Gemini"""
        formatted = []
        for tool in tools:
            props = tool.inputSchema.get("properties", {})
            params = []
            for param_name, param_info in props.items():
                param_desc = param_info.get("description", "")
                param_type = param_info.get("type", "string")
                params.append(f"  - {param_name} ({param_type}): {param_desc}")
            
            params_str = "\n".join(params) if params else "  (sin parámetros)"
            formatted.append(f"- {tool.name}: {tool.description}\n  Parámetros:\n{params_str}")
        
        return "\n\n".join(formatted)
    
    async def chat_loop(self):
        """Ejecuta un loop interactivo de chat"""
        print("💬 Cliente MCP con Gemini iniciado")
        print("Escribe tus consultas o 'quit' para salir.\n")
        
        while True:
            try:
                query = input("Query: ").strip()
                
                if query.lower() in ['quit', 'exit', 'salir']:
                    print("\n👋 ¡Hasta luego!")
                    return  # Usar return en lugar de break
                
                if not query:
                    continue
                
                print("\n⏳ Procesando...")
                response = await self.process_query(query)
                print(f"\n🤖 Respuesta:\n{response}\n")
                
            except KeyboardInterrupt:
                print("\n\n👋 ¡Hasta luego!")
                return  # Salir limpiamente
            except EOFError:
                print("\n\n👋 ¡Hasta luego!")
                return
            except Exception as e:
                print(f"\n❌ Error: {str(e)}\n")
    
    async def cleanup(self):
        """Limpia los recursos"""
        await self.exit_stack.aclose()


async def main():
    """Función principal"""
    if len(sys.argv) < 2:
        print("Uso: python mcp_gemini_chat.py <ruta_al_servidor_mcp>")
        print("\nEjemplo:")
        print("  python mcp_gemini_chat.py woocommerce_server.py")
        sys.exit(1)
    
    client = MCPGeminiClient()
    try:
        await client.connect_to_server(sys.argv[1])
        await client.chat_loop()
    except KeyboardInterrupt:
        print("\n\n👋 ¡Hasta luego!")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
    finally:
        try:
            await client.cleanup()
        except Exception:
            pass  # Ignorar errores de cleanup


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Adiós!")
        sys.exit(0)
