# AnythingAI Assignment

Full-stack task manager with role-based access control, JWT auth (access + refresh), Redis-backed refresh token storage, and a React dashboard. Deployed API is currently pointed at Vercel; you can run locally or deploy on Render/other hosts.

## Stack
- Backend: Node.js, Express 5, Sequelize (SQLite default), Redis client, JWT, bcrypt
- Frontend: React 19 + Vite, React Router 7, Axios with cookie-based auth
- Auth: HTTP-only cookies for access/refresh tokens, refresh tokens stored/validated in Redis

## Features
- User registration/login with roles (`user`, `admin`)
- Refresh-token rotation and Redis invalidation on logout
- RBAC on tasks: admins see/manage all tasks; users only their own
- CRUD for tasks with status (`pending`/`completed`)
- Axios interceptor auto-refreshes access token on 401

## Project Structure
- `server/src/app.js` – Express app, routes, DB boot, cookie/cors setup
- `server/src/routes/*` – Auth and task routes
- `server/src/controllers/*` – Business logic for auth and tasks
- `server/src/models/*` – Sequelize models (SQLite storage by default)
- `client/src` – React app (login, register, dashboard), Axios instance

## API (base: `/api`)
- `POST /auth/register` – `{ email, password, role? }`
- `POST /auth/login` – `{ email, password }` → sets `accessToken` (15m) + `refreshToken` (7d) cookies
- `POST /auth/refresh` – rotate tokens using refresh cookie
- `POST /auth/logout` – clears cookies + deletes refresh entry in Redis
- `GET /auth/me` – returns `{ id, email, role }`
- `GET /tasks` – admin: all tasks; user: own tasks
- `POST /tasks` – `{ title, status }`
- `PUT /tasks/:id` – `{ title, status }`
- `DELETE /tasks/:id`

## Environment Variables (server/.env)
```
PORT=5000
JWT_SECRET=change-me
REFRESH_SECRET=change-me-too
REDIS_URL=redis://<user>:<pass>@<host>:<port>
```
Defaults: SQLite DB at `server/src/database.sqlite`; CORS origin in `app.js` is set to the Vercel frontend URL—adjust for local dev.

## Local Development
1) Install deps
```
cd server && npm install
cd ../client && npm install
```
2) Run backend (dev)
```
cd server
npm run dev
```
3) Run frontend
```
cd client
npm run dev
```
Frontend dev server: http://localhost:5173 (Vite default). Point Axios base URL to your local API if needed (see `client/src/api/axios.js`).

## Deploying to Render (or similar)
- Set environment variables in Render dashboard (`PORT`, `JWT_SECRET`, `REFRESH_SECRET`, `REDIS_URL`).
- Use a persistent Redis add-on or external Upstash instance.
- Set build command (server): `npm install` and start: `npm run start` with `root` = `server`.
- For the frontend, build in `client` and serve static files (e.g., Render static site) or host on Vercel; update `client/src/api/axios.js` to match your API base URL and CORS origin in `server/src/app.js`.

## Known Notes
- `app.js` currently calls `app.listen` twice (inside `sequelize.sync` and again when `NODE_ENV !== 'production'`); remove the extra listener before production to avoid port-in-use errors.
- Cookies are set with `secure: false`; set `secure: true` and `sameSite` as needed when serving over HTTPS.
