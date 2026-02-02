# Cloudflare WebSocket Signal Server

Este proyecto es un servidor de WebSocket para señales (no datos) implementado como un Cloudflare Worker. Se utiliza para notificar eventos en tiempo real en el chat de Laravel, como:

- `newmessage`: Dispara la actualización del panel de mensajes.
- `user-online` / `user-offline`: Indica el estado de los usuarios.

No se transmite el contenido de los mensajes, solo señales.

## Uso

### Desarrollo local

1. Instala Wrangler si no lo tienes:
   ```bash
   npm install -g wrangler
   ```
2. Ejecuta el worker localmente:
   ```bash
   npm install
   npm run dev
   ```

### Despliegue

1. Configura tu cuenta de Cloudflare Workers.
2. Publica el worker:
   ```bash
   npm run deploy
   ```

## worker.js
El archivo `worker.js` contiene la lógica del WebSocket para manejar y transmitir señales entre clientes conectados.

---

Este proyecto es independiente del backend Laravel y solo se encarga de la señalización en tiempo real.
