# Walkthrough - Cloudflare Task Manager

I have successfully built the Task Management application using **Remix (React Router v7)** on **Cloudflare Pages** with **D1 Database** and **Drizzle ORM**.

## Features Implemented

### 1. Public Landing Page (`/`)
- Displays project information.
- Shows dynamic environment variable usage (verified integration).
- Links to the private dashboard.

### 2. Private Dashboard (`/dashboard`)
- **Layout**: Sidebar navigation with simulated user profile.
- **Task List**: Real-time fetching of tasks from local D1 database.
- **Create Task**: Form to add new tasks (Title, Description).
- **Update Status**: Toggle tasks between "pending" and "done".
- **Delete Task**: Remove tasks from the database.

## Technical Stack
- **Framework**: React Router v7 (formerly Remix).
- **Platform**: Cloudflare Pages + Workers.
- **Database**: Cloudflare D1 (SQLite).
- **ORM**: Drizzle ORM (Type-safe SQL).
- **Styling**: TailwindCSS.

## verification Results
- **Type Check**: Passed (`npm run typecheck`).
- **Build**: Passed (`npm run build`).
- **Database**: Migrations applied and schema verified.

## How to Run Locally

1. **Install Dependencies** (if not already):
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`.

3. **Database Management**:
   - View local DB: `npx wrangler d1 execute task-db --local --command "SELECT * FROM tasks"`

## Deployment Instructions

1. **Login to Cloudflare**:
   ```bash
   npx wrangler login
   ```

2. **Create Remote Database**:
   ```bash
   npx wrangler d1 create task-db
   ```
   *Update `wrangler.jsonc` with the new `database_id`.*

3. **Apply Migrations to Production**:
   ```bash
   npx wrangler d1 migrations apply task-db --remote
   ```

4. **Deploy Application**:
   ```bash
   npm run deploy
   ```

## Authentication

The dashboard is protected by a custom Cookie-based authentication system.

- **Default Credentials**:
    - Username: `admin`
    - Password: `admin`
- **Configuration**:
    - Update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `wrangler.jsonc` (local) or via Cloudflare Dashboard (production).

## Known URLs

| Environment | URL | Description |
|---|---|---|
| **Local Development** | `http://localhost:5173` | Public landing page. |
| **Local Dashboard** | `http://localhost:5173/dashboard` | Protected admin area. |
| **Production (Public)** | `https://<your-project>.pages.dev/` | Live public page. |
| **Production (Dashboard)** | `https://<your-project>.pages.dev/dashboard` | Protected admin area. |
