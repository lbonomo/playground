# Proyecto Tailwind CSS con PHP

Este es un proyecto de ejemplo que demuestra cómo configurar Tailwind CSS v4 con archivos PHP.

## Pasos para la configuración

1.  **Instalar dependencias:**

    ```bash
    npm install
    ```

2.  **Construir el CSS:**

    ```bash
    npm run build
    ```

    Este comando utiliza `@tailwindcss/cli` para escanear los archivos `.php` en el proyecto y generar el archivo `style.css` con las clases de Tailwind utilizadas.

## Estructura del Proyecto

*   `src/input.css`: El archivo de entrada de CSS que importa Tailwind.
*   `tailwind.config.js`: El archivo de configuración de Tailwind. En la v4, la configuración del contenido es automática, por lo que este archivo se utiliza principalmente para personalizaciones del tema y plugins.
*   `index.php`: Un archivo PHP de ejemplo que utiliza clases de Tailwind.
*   `style.css`: El archivo CSS generado.
