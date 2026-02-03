# Chatboot
Larabel + Cloudflare (Websocket)

## 🚀 Resumen de la Implementación
```bash
composer install
cp  .env.example .env
php artisan key:generate
php artisan db:seed
npm install 
npm run build
```



1. Instalación y Autenticación:
    * Se instaló Laravel 11 con Breeze (Blade stack) para manejar el registro y login de usuarios de
      forma sencilla.
    * La base de datos se configuró con SQLite para que no tengas que instalar servidores
      adicionales.

2. Base de Datos y Modelos:
    * Se creó el modelo Message y su migración correspondiente con campos para from_user_id,
      to_user_id y content.
    * Se definieron las relaciones en los modelos User (mensajes enviados/recibidos) y Message
      (remitente/destinatario).
      ```bash
      php artisan migrate --seed
      ```
3. Lógica del Chat:
    * `ChatController`: Maneja la visualización de la lista de usuarios, la sala de chat individual
      y el envío de mensajes.
    * Rutas: Se configuraron rutas protegidas para acceder al dashboard (lista de usuarios) y al
      chat.

4. Interfaz de Usuario (Vistas):
    * Dashboard (`/dashboard`): Muestra una lista de todos los usuarios registrados (excepto tú
      mismo) con un botón para "Chatear".
    * Sala de Chat (`/chat/{user}`): Muestra el historial de mensajes con otro usuario y un
      formulario para enviar nuevos mensajes. Los mensajes propios aparecen a la derecha (azul) y
      los del otro usuario a la izquierda (gris).

5. Datos de Prueba (Seeders):
    * Se pobló la base de datos con usuarios de prueba para que puedas empezar de inmediato.
    * Usuarios creados:
        * Usuario 1: alice@example.com / password
        * Usuario 2: bob@example.com / password
        * +5 usuarios aleatorios.

## 🛠️ Pasos para Ejecutar el Proyecto

Para ver el proyecto en acción, abre dos terminales y ejecuta los siguientes comandos:

  1. Compilar los estilos (Frontend):
    Esto es necesario para que Tailwind CSS funcione correctamente.
    ```bash
    npm install && npm run dev
    ```

  2. Iniciar el Servidor (Backend):
    ```bash
    php artisan serve
    ```

  3. Iniciar el Servidor (WebSocket con Cloudflare Workers):
    Implementación en cloudflare-websocket/worker.js
    Despliega el worker usando Wrangler o la interfaz de Cloudflare Workers.
    El WebSocket solo transmite señales como:
      - `newmessage` (para disparar la actualización del panel de mensajes)
      - `user-online` / `user-offline` (para mostrar el estado de los usuarios)
    No se envían datos de mensajes por el WebSocket, solo señales.
    Ejemplo de despliegue local:
    ```bash
    wrangler dev cloudflare-websocket/worker.js
    ```


## 🧪 Cómo Probarlo

  1. Ve a http://localhost:8000 en tu navegador.
  2. Inicia sesión con `alice@example.com` (contraseña: password).
  3. Abre una ventana de incógnito (o otro navegador) y ve a http://localhost:8000.
  4. Inicia sesión con `bob@example.com` (contraseña: password).
  5. Desde el Dashboard, haz clic en "Chatear" con el otro usuario.
  6. ¡Envía mensajes entre las dos ventanas para ver el chat en funcionamiento! (Recarga la página
    para ver los mensajes nuevos, ya que es una implementación básica sin WebSockets por ahora).
