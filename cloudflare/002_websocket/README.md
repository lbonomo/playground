# Tutorial: Cloudflare Workers Websocket Broadcast

Este es un ejemplo minimalista de una aplicación de **Notificaciones Push** (Broadcast) utilizando **Cloudflare Workers** y **Durable Objects**.

## ¿Qué hace la app?

La aplicación permite que múltiples clientes (navegadores) se conecten a un mismo servidor WebSocket. Cuando uno de ellos (o un sistema externo) envía un mensaje de "Broadcast", todos los clientes conectados reciben ese mensaje instantáneamente.

## Arquitectura

La solución se compone de tres partes principales:

### 1. El Worker (`src/index.ts`)
Actúa como la puerta de entrada.
- Sirve el **Frontend** (HTML/JS) cuando entras a la página.
- Intercepta las peticiones de conexión WebSocket (`/websocket`).
- Intercepta las peticiones de envío de mensajes (`/broadcast`).
- **Importante**: Redirige tanto los WebSockets como las peticiones de broadcast a una única instancia de **Durable Object**. Esto asegura que todos los usuarios estén en la misma "sala".

### 2. El Durable Object (`src/WebSocketSource.ts`)
Es el corazón del sistema que mantiene el estado.
- **Persistencia en memoria**: A diferencia de un Worker normal que muere después de responder, el Durable Object se mantiene vivo mientras haya conexiones.
- **Gestión de Conexiones**: Acepta los WebSockets entrantes y Cloudflare se encarga automáticamente de gestionarlos (`this.ctx.getWebSockets()`).
- **Broadcast**: Cuando recibe la orden, recorre todas las conexiones activas y les envía el mensaje.

### 3. El Cliente (Frontend)
Un simple HTML que:
- Se conecta automáticamente a `wss://tu-dominio/websocket`.
- Escucha eventos `onmessage` para mostrar alertas.
- Tiene un botón que hace un `fetch('/broadcast?message=...')` para probar el sistema.

## Flujo de Datos

1.  **Conexión**:
    `Usuario` -> `Worker` -> `Durable Object` (Se guarda la conexión).

2.  **Envío de Notificación**:
    `Admin/Usuario` -> `POST /broadcast` -> `Worker` -> `Durable Object`.

3.  **Recepción**:
    `Durable Object` -> `Itera conexiones` -> `Push message` -> `Todos los Usuarios`.

## Cómo probarlo

1.  **Iniciar localmente**:
    ```bash
    npx wrangler dev
    ```
2.  **Abrir en el navegador**:
    Entra a `http://localhost:8787`. Verás que el estado cambia a **Connected**.
3.  **Simular usuarios**:
    Abre la misma dirección en **otra pestaña** o ventana de incógnito.
4.  **Enviar mensaje**:
    Escribe algo y manda el broadcast. ¡Verás que aparece en ambas ventanas al mismo tiempo!

## Requisitos
- Una cuenta de Cloudflare.
- Workers Paid (o plan gratuito con acceso a Durable Objects si está disponible).
