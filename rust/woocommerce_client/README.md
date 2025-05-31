# WooCommerce Client

Cliente en Rust para interactuar con la API de WooCommerce.

## Características

- Autenticación con claves API.
- Soporte para operaciones CRUD sobre productos, pedidos y clientes.
- Manejo de paginación y errores.

## Configuración

Antes de usar el cliente, debes configurar las credenciales de acceso a tu tienda WooCommerce. Crea un archivo `config.ini` en el directorio `~/.config/wctools/` con el siguiente contenido:

```ini
WOOCOMMERCE_URL             = https://perfumeriaarabes.lndo.site
WOOCOMMERCE_CONSUMER_KEY    = ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET = cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Reemplaza los valores con los datos de tu tienda. El cliente leerá automáticamente este archivo de configuración al ejecutarse.

## Uso

Este proyecto proporciona un binario que puedes ejecutar directamente para interactuar con tu tienda WooCommerce. No es un módulo o librería para ser incluido en otros proyectos.

Consulta la ayuda del binario para ver las opciones disponibles:

```bash
woocommerce_client --help
```

### Ejemplo: Obtener un producto

Puedes obtener la información de un producto específico usando el comando `getProduct`. Por ejemplo, para obtener el producto con SKU CHAM047 y mostrar el JSON de forma legible en la consola:

```bash
woocommerce_client --action getProductBySKU --sku CHAM047 | jq
```

Asegúrate de tener instalado [`jq`](https://stedolan.github.io/jq/) para formatear la salida JSON.

Salida esperada:

```json
{
    "id": 123,
    "name": "Camiseta WooCommerce",
    "price": "19.99",
    "stock_quantity": 42,
    "status": "publish"
}
```