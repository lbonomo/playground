<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).




  🚀 Resumen de la Implementación

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

  🛠️ Pasos para Ejecutar el Proyecto

  Para ver el proyecto en acción, abre dos terminales y ejecuta los siguientes comandos:

   1. Compilar los estilos (Frontend):
      Esto es necesario para que Tailwind CSS funcione correctamente.

   1     npm install && npm run dev

   2. Iniciar el Servidor (Backend):

   1     php artisan serve

  🧪 Cómo Probarlo

   1. Ve a http://localhost:8000 en tu navegador.
   2. Inicia sesión con `alice@example.com` (contraseña: password).
   3. Abre una ventana de incógnito (o otro navegador) y ve a http://localhost:8000.
   4. Inicia sesión con `bob@example.com` (contraseña: password).
   5. Desde el Dashboard, haz clic en "Chatear" con el otro usuario.
   6. ¡Envía mensajes entre las dos ventanas para ver el chat en funcionamiento! (Recarga la página
      para ver los mensajes nuevos, ya que es una implementación básica sin WebSockets por ahora).
