# Cloudflare Task Manager

A full-stack task management application built with **React Router v7** (formerly Remix), **Cloudflare Pages**, **Cloudflare D1** (SQLite), and **Drizzle ORM**.

## Features

- 🚀 Full-stack React Router v7 application
- 🗄️ **D1 Database**: Serverless SQLite on the Edge
- 🌧️ **Drizzle ORM**: Type-safe database interactions
- 🔐 **Cloudflare Access**: Secure private dashboard (Zero Trust)
- 🎨 TailwindCSS styling

## Database Setup

This project uses Cloudflare D1. You need to create the database before running the app.

### 1. Create the Database
Run the following command to create a new D1 database:

```bash
npx wrangler d1 create task-db
```

### 2. Configure `wrangler.jsonc`
Copy the `database_id` output from the previous command and update your `wrangler.jsonc` file:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "task-db",
    "database_id": "<YOUR_DATABASE_ID_HERE>",
    "migrations_dir": "drizzle"
  }
]
```

### 3. Apply Migrations
Initialize the database schema by applying migrations:

**For Local Development:**
```bash
npx wrangler d1 migrations apply task-db --local
```

**For Production:**
```bash
npx wrangler d1 migrations apply task-db --remote
```

## Development

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173`.

## Deployment

Deploy to Cloudflare Pages:

```bash
npm run deploy
```

> **Note:** To secure the `/dashboard` route in production, create a **Cloudflare Access** application in your Zero Trust dashboard and restrict access to authorized emails.
