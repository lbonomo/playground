# Laravel Chat Project Context

## Project Overview
This directory (`/home/lbonomo/proyectos/playground/laravel/chat`) is the root for a new Laravel application focused on building a chat system. Currently, the directory is empty and ready for project initialization.

## Initialization
To scaffold a new Laravel application in this directory, run the following command:

```bash
composer create-project laravel/laravel .
```

Alternatively, if you have the Laravel installer globally installed:

```bash
laravel new .
```

## Intended Architecture (Standard Laravel)
Once initialized, the project will follow the standard Laravel structure:
- **`app/`**: Core application code (Models, Controllers, etc.).
- **`routes/`**: Route definitions (`web.php`, `api.php`, `channels.php` for broadcasting).
- **`resources/`**: Views (Blade templates) and assets (JS/CSS).
- **`database/`**: Migrations, factories, and seeders.
- **`tests/`**: Feature and Unit tests.

## Key Technologies
- **Framework:** Laravel (PHP)
- **Frontend:** Likely Blade with Alpine.js/Livewire or Vue/React via Inertia (depending on choice).
- **Real-time:** Laravel Reverb or Pusher (essential for chat functionality).
- **Database:** MySQL/PostgreSQL/SQLite.

## Development Workflow
1.  **Install Dependencies:** `composer install` & `npm install`
2.  **Environment Setup:** Copy `.env.example` to `.env` and configure database/broadcasting settings.
3.  **Key Generation:** `php artisan key:generate`
4.  **Serve Application:** `php artisan serve`
5.  **Compile Assets:** `npm run dev`

## TODOs
- [ ] Initialize Laravel project.
- [ ] Configure broadcasting driver (Reverb/Pusher).
- [ ] Set up user authentication (Breeze/Jetstream).
- [ ] Create `Message` model and migration.
- [ ] Implement real-time event broadcasting.
