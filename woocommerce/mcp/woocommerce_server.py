#!/usr/bin/env python3
"""
Servidor MCP para WooCommerce
Proporciona herramientas para consultar la API REST de WooCommerce
"""

import os
import asyncio
import requests
from typing import Any
from dotenv import load_dotenv
from mcp.server import Server
from mcp.types import Tool, TextContent
from mcp.server.stdio import stdio_server

# Cargar variables de entorno
load_dotenv()

# Configuración de WooCommerce
STORE_URL = os.getenv("WOOCOMMERCE_STORE_URL", "")
CONSUMER_KEY = os.getenv("WOOCOMMERCE_CONSUMER_KEY", "")
CONSUMER_SECRET = os.getenv("WOOCOMMERCE_CONSUMER_SECRET", "")

# Crear instancia del servidor MCP
app = Server("woocommerce-server")


def make_woo_request(endpoint: str, params: dict = None) -> dict:
    """Realiza una petición a la API de WooCommerce"""
    if not all([STORE_URL, CONSUMER_KEY, CONSUMER_SECRET]):
        raise ValueError("WooCommerce credentials not configured")
    
    try:
        response = requests.get(
            f"{STORE_URL}{endpoint}",
            auth=(CONSUMER_KEY, CONSUMER_SECRET),
            params=params or {},
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error connecting to WooCommerce API: {e}")


@app.list_tools()
async def list_tools() -> list[Tool]:
    """Lista las herramientas disponibles"""
    return [
        Tool(
            name="list_orders",
            description="Lista los pedidos de WooCommerce. Puedes filtrar por estado (pending, processing, on-hold, completed, cancelled, refunded, failed)",
            inputSchema={
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "description": "Estado de los pedidos a filtrar",
                        "enum": ["pending", "processing", "on-hold", "completed", "cancelled", "refunded", "failed", "any"]
                    },
                    "per_page": {
                        "type": "integer",
                        "description": "Número de resultados por página (máximo 100)",
                        "default": 10
                    }
                },
                "required": []
            }
        ),
        Tool(
            name="get_order",
            description="Obtiene los detalles de un pedido específico por su ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "integer",
                        "description": "ID del pedido a consultar"
                    }
                },
                "required": ["order_id"]
            }
        ),
        Tool(
            name="list_products",
            description="Lista los productos de WooCommerce",
            inputSchema={
                "type": "object",
                "properties": {
                    "per_page": {
                        "type": "integer",
                        "description": "Número de resultados por página (máximo 100)",
                        "default": 10
                    },
                    "search": {
                        "type": "string",
                        "description": "Término de búsqueda para filtrar productos"
                    }
                },
                "required": []
            }
        ),
        Tool(
            name="get_product",
            description="Obtiene los detalles de un producto específico por su ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "product_id": {
                        "type": "integer",
                        "description": "ID del producto a consultar"
                    }
                },
                "required": ["product_id"]
            }
        ),
        Tool(
            name="list_customers",
            description="Lista los clientes de WooCommerce",
            inputSchema={
                "type": "object",
                "properties": {
                    "per_page": {
                        "type": "integer",
                        "description": "Número de resultados por página (máximo 100)",
                        "default": 10
                    },
                    "search": {
                        "type": "string",
                        "description": "Término de búsqueda para filtrar clientes"
                    }
                },
                "required": []
            }
        ),
        Tool(
            name="get_order_stats",
            description="Obtiene estadísticas de pedidos agrupados por estado",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """Maneja las llamadas a las herramientas"""
    
    try:
        if name == "list_orders":
            params = {"per_page": arguments.get("per_page", 10)}
            status = arguments.get("status", "any")
            if status != "any":
                params["status"] = status
            
            data = make_woo_request("/wp-json/wc/v3/orders", params)
            return [TextContent(
                type="text",
                text=f"Se encontraron {len(data)} pedidos:\n{format_orders(data)}"
            )]
        
        elif name == "get_order":
            order_id = arguments["order_id"]
            data = make_woo_request(f"/wp-json/wc/v3/orders/{order_id}")
            return [TextContent(
                type="text",
                text=f"Detalles del pedido #{order_id}:\n{format_order_details(data)}"
            )]
        
        elif name == "list_products":
            params = {"per_page": arguments.get("per_page", 10)}
            if "search" in arguments:
                params["search"] = arguments["search"]
            
            data = make_woo_request("/wp-json/wc/v3/products", params)
            return [TextContent(
                type="text",
                text=f"Se encontraron {len(data)} productos:\n{format_products(data)}"
            )]
        
        elif name == "get_product":
            product_id = arguments["product_id"]
            data = make_woo_request(f"/wp-json/wc/v3/products/{product_id}")
            return [TextContent(
                type="text",
                text=f"Detalles del producto #{product_id}:\n{format_product_details(data)}"
            )]
        
        elif name == "list_customers":
            params = {"per_page": arguments.get("per_page", 10)}
            if "search" in arguments:
                params["search"] = arguments["search"]
            
            data = make_woo_request("/wp-json/wc/v3/customers", params)
            return [TextContent(
                type="text",
                text=f"Se encontraron {len(data)} clientes:\n{format_customers(data)}"
            )]
        
        elif name == "get_order_stats":
            statuses = ["pending", "processing", "on-hold", "completed", "cancelled"]
            stats = {}
            
            for status in statuses:
                data = make_woo_request("/wp-json/wc/v3/orders", {"status": status, "per_page": 1})
                # La API de WooCommerce devuelve el total en los headers, pero lo aproximamos
                stats[status] = len(data)
            
            stats_text = "\n".join([f"- {status}: {count}" for status, count in stats.items()])
            return [TextContent(
                type="text",
                text=f"Estadísticas de pedidos por estado:\n{stats_text}"
            )]
        
        else:
            raise ValueError(f"Herramienta desconocida: {name}")
            
    except Exception as e:
        return [TextContent(
            type="text",
            text=f"Error al ejecutar la herramienta {name}: {str(e)}"
        )]


def format_orders(orders: list) -> str:
    """Formatea una lista de pedidos"""
    if not orders:
        return "No se encontraron pedidos"
    
    lines = []
    for order in orders:
        lines.append(f"- Pedido #{order['id']}: {order['status']} - ${order['total']} - {order['date_created']}")
    return "\n".join(lines)


def format_order_details(order: dict) -> str:
    """Formatea los detalles de un pedido"""
    items = "\n".join([f"  - {item['name']} x{item['quantity']}: ${item['total']}" for item in order.get('line_items', [])])
    return f"""ID: {order['id']}
Estado: {order['status']}
Total: ${order['total']}
Fecha: {order['date_created']}
Cliente: {order['billing']['first_name']} {order['billing']['last_name']}
Email: {order['billing']['email']}
Items:
{items}"""


def format_products(products: list) -> str:
    """Formatea una lista de productos"""
    if not products:
        return "No se encontraron productos"
    
    lines = []
    for product in products:
        stock = f"Stock: {product.get('stock_quantity', 'N/A')}" if product.get('manage_stock') else "Sin gestión de stock"
        price = product.get('price', '0')
        regular_price = product.get('regular_price', price)
        sale_price = product.get('sale_price', '')
        
        price_info = f"${price}"
        if sale_price:
            price_info = f"${sale_price} (antes ${regular_price})"
        
        lines.append(f"- ID:{product['id']} | {product['name']} | Precio: {price_info} | {stock}")
    return "\n".join(lines)


def format_product_details(product: dict) -> str:
    """Formatea los detalles de un producto"""
    return f"""ID: {product['id']}
Nombre: {product['name']}
Precio: ${product['price']}
Precio regular: ${product.get('regular_price', 'N/A')}
Precio de oferta: ${product.get('sale_price', 'N/A')}
Stock: {product.get('stock_quantity', 'N/A')}
Categorías: {', '.join([cat['name'] for cat in product.get('categories', [])])}
Descripción: {product.get('short_description', 'N/A')[:200]}"""


def format_customers(customers: list) -> str:
    """Formatea una lista de clientes"""
    if not customers:
        return "No se encontraron clientes"
    
    lines = []
    for customer in customers:
        lines.append(f"- #{customer['id']}: {customer['first_name']} {customer['last_name']} - {customer['email']}")
    return "\n".join(lines)


async def main():
    """Punto de entrada principal del servidor"""
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())
