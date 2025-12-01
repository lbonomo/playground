## Reference

https://github.com/WordPress/mcp-adapter
https://github.com/WordPress/abilities-api
https://github.com/woocommerce/wc-mcp-ability
https://modelcontextprotocol.io/docs/getting-started/intro

## Install
```bash
python3 -m venv ./env
source ./env/bin/activate
pip install -r requirements.txt
```


## Consultas
- Ejemplo de consulta sobre WooCommerce:
  ```bash
  python mcp_gemini_chat.py "Dame un resumen de las ordenes pendientes"
  ```
- Ejemplo de consulta general:
  ```bash 
  python mcp_gemini_chat.py "Cual es la capital de Argentina?"
  ```