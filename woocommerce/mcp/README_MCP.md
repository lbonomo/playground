# Cliente MCP con Gemini para WooCommerce

Este proyecto implementa el **Model Context Protocol (MCP)** para consultar datos de WooCommerce usando Gemini como modelo de lenguaje.

## 🏗️ Arquitectura

El proyecto consta de dos componentes principales:

### 1. **Servidor MCP** (`woocommerce_server.py`)
Servidor MCP que expone herramientas para interactuar con la API REST de WooCommerce:
- `list_orders` - Lista pedidos con filtros por estado
- `get_order` - Obtiene detalles de un pedido específico
- `list_products` - Lista productos
- `get_product` - Obtiene detalles de un producto
- `list_customers` - Lista clientes
- `get_order_stats` - Estadísticas de pedidos

### 2. **Cliente MCP** (`mcp_gemini_chat.py`)
Cliente que conecta al servidor MCP y usa **Gemini** (en lugar de Claude/Anthropic) para:
- Procesar consultas en lenguaje natural
- Decidir qué herramientas usar
- Ejecutar las herramientas a través del servidor MCP
- Generar respuestas comprensibles

## 📋 Requisitos

- Python 3.13+
- Cuenta en Google AI Studio (para API de Gemini)
- Tienda WooCommerce con API REST habilitada

## 🚀 Instalación

1. **Clonar o descargar el proyecto**

2. **Crear entorno virtual e instalar dependencias:**

```bash
python -m venv env
source env/bin/activate  # En Windows: env\Scripts\activate
pip install -r requirements.txt
```

3. **Configurar variables de entorno:**

```bash
cp .env.example .env
```

Edita el archivo `.env` y añade tus credenciales:

```env
# API de Gemini
GEMINI_API_KEY=tu_api_key_de_gemini
GEMINI_MODEL=gemini-1.5-flash

# WooCommerce
WOOCOMMERCE_STORE_URL=https://tu-tienda.com
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxx
```

### Obtener API Key de Gemini:
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la key al archivo `.env`

### Obtener credenciales de WooCommerce:
1. En tu tienda WooCommerce: `WooCommerce > Ajustes > Avanzado > REST API`
2. Crea una nueva key con permisos de lectura
3. Copia las credenciales al archivo `.env`

## 💻 Uso

### Modo Interactivo (Recomendado)

Inicia el cliente en modo chat interactivo:

```bash
python mcp_gemini_chat.py woocommerce_server.py
```

Esto abrirá una interfaz de chat donde puedes hacer preguntas:

```
💬 Cliente MCP con Gemini iniciado
✓ Conectado al servidor MCP
✓ Herramientas disponibles: ['list_orders', 'get_order', 'list_products', ...]

Query: ¿Cuántos pedidos pendientes tengo?
⏳ Procesando...
🔧 Usando herramienta: list_orders
📋 Argumentos: {'status': 'pending'}

🤖 Respuesta:
Tienes 5 pedidos pendientes actualmente.
- Pedido #123: pending - $150.00
- Pedido #124: pending - $89.50
...

Query: Muéstrame los productos más vendidos
Query: quit
👋 ¡Hasta luego!
```

## 🔧 Ejemplos de Consultas

- "¿Cuántos pedidos pendientes tengo?"
- "Muéstrame los últimos 5 pedidos completados"
- "Lista los productos que tienen 'camiseta' en el nombre"
- "Dame información del pedido número 123"
- "¿Cuántos clientes tengo registrados?"
- "Muéstrame las estadísticas de pedidos"

## 📁 Estructura del Proyecto

```
.
├── mcp_gemini_chat.py      # Cliente MCP con Gemini
├── woocommerce_server.py   # Servidor MCP para WooCommerce
├── requirements.txt        # Dependencias Python
├── .env.example           # Ejemplo de configuración
├── .env                   # Tu configuración (no commitear)
└── README.md             # Este archivo
```

## 🔄 Flujo de Funcionamiento

1. **Usuario hace una pregunta** en lenguaje natural
2. **Cliente envía la pregunta a Gemini** junto con la descripción de herramientas disponibles
3. **Gemini decide** qué herramienta usar y con qué parámetros
4. **Cliente ejecuta la herramienta** a través del servidor MCP
5. **Servidor consulta la API de WooCommerce** y devuelve datos
6. **Cliente envía los datos a Gemini** para generar una respuesta
7. **Usuario recibe** una respuesta en lenguaje natural

## 🛡️ Seguridad

- **Nunca commitees** el archivo `.env` con tus credenciales
- El archivo `.gitignore` ya está configurado para ignorar `.env`
- Usa claves de API con **permisos mínimos necesarios**
- Para WooCommerce, usa permisos de **solo lectura** si solo necesitas consultar datos

## 🐛 Solución de Problemas

### Error: "No se ha podido resolver la importación mcp"
```bash
pip install mcp
```

### Error: "WooCommerce credentials not configured"
Verifica que tu archivo `.env` tenga las credenciales correctas de WooCommerce.

### Error: "GEMINI_API_KEY not found"
Asegúrate de tener tu API key de Gemini en el archivo `.env`.

### El servidor no responde
- Verifica que la URL de tu tienda WooCommerce sea correcta
- Comprueba que la API REST esté habilitada en WooCommerce
- Verifica los permisos de las credenciales

## 🔗 Referencias

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Google Gemini API](https://ai.google.dev/)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)

## 📝 Notas

- Este cliente usa **Gemini** en lugar de Claude/Anthropic (como en la documentación oficial de MCP)
- El servidor MCP es específico para WooCommerce pero puede adaptarse a otras APIs
- Puedes extender el servidor añadiendo más herramientas en `woocommerce_server.py`

## 🤝 Contribuciones

Si quieres añadir más funcionalidades:
1. Añade nuevas herramientas en `woocommerce_server.py`
2. Las herramientas se exponen automáticamente al cliente
3. Gemini aprenderá a usarlas automáticamente

## 📄 Licencia

Este proyecto es de código abierto.
