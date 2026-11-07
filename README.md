# QR Code Manager

Create dynamic QR codes and change where they point at any time, without reprinting them.

- **Dashboard** (password protected): create, edit, download and delete QR codes, and see how often each one was scanned.
- **Public redirect**: each QR code points to `https://<your-app>/r/<id>`, which forwards visitors to the website you set.

Stack: Node.js + Express + Sequelize (Postgres) on the server, React (Create React App + MUI) on the client. In production, one Node service serves both the API and the built React app.

## Free hosting setup (Neon + Render)

Total cost: 0 €. Takes about 15 minutes.

### 1. Create the database on Neon

1. Sign up at <https://neon.com> (no credit card needed).
2. Create a project. Pick the region **AWS Europe Central 1 (Frankfurt)** so it's close to the server.
3. Click **Connect** and copy the connection string. It looks like
   `postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`.

The app creates its table automatically on first start.

### 2. Deploy the app on Render

1. Sign up at <https://render.com> with your GitHub account.
2. Click **New → Blueprint** and select this repository. Render reads `render.yaml`.
3. When asked for values:
   - `DATABASE_URL`: paste the Neon connection string.
   - `ADMIN_PASSWORD`: choose the password for the dashboard.
4. Click **Apply** and wait for the first deploy (about 3–5 minutes).
5. Open the URL Render shows (e.g. `https://qr-manager-xxxx.onrender.com`) and log in.

Every push to the main branch redeploys automatically.

> Already have a Render web service from before? Instead of the Blueprint, open it and set:
> **Build command** `npm run build`, **Start command** `npm start`, **Health check path** `/health`,
> and the environment variables `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET` (any long random text),
> `NODE_ENV=production`, `NODE_VERSION=20`.

### 3. Keep it awake (important for QR codes)

Render's free plan puts the app to sleep after 15 minutes without visitors. Waking up takes up to a
minute, which is a bad experience for someone scanning a QR code. To prevent that:

1. Sign up at <https://cron-job.org> (free).
2. Create a cron job that calls `https://<your-app>.onrender.com/health` **every 10 minutes**.

One always-on service fits inside Render's 750 free hours per month.

### 4. Optional: your own domain

QR codes contain the app's address forever. If you plan to print many codes, add a custom domain
first (Render → your service → Settings → Custom Domains), then set the environment variable
`PUBLIC_BASE_URL=https://qr.yourdomain.com`. Codes created after that use your domain, so you can move
hosts later without breaking them.

## Running locally

Requires Node.js 20 or newer.

```bash
npm run install-all       # install root, server and client packages
cp .env.example .env      # then fill in DATABASE_URL (a Neon dev branch works well)
npm run dev               # API on http://localhost:5000, React on http://localhost:3000
```

If `ADMIN_PASSWORD` is empty locally, the dashboard password is `admin`.

To test the production build locally: `npm run build && npm start`, then open <http://localhost:5000>.

## Environment variables

| Name | Required | What it does |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string |
| `ADMIN_PASSWORD` | yes (production) | Dashboard password. Without it, nobody can log in in production |
| `SESSION_SECRET` | recommended | Signs login tokens. Changing it logs everyone out |
| `PUBLIC_BASE_URL` | no | Address used inside new QR codes. Defaults to Render's URL |
| `PORT` | no | Set automatically by Render; defaults to 5000 |

## API

All `/api` routes except `/api/login` need `Authorization: Bearer <token>`.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/login` | `{ password }` → `{ token, expiresAt }` (token valid 7 days) |
| GET | `/api/cards` | List cards |
| POST | `/api/generate` | `{ customerUrl? }` → new card |
| GET | `/api/cards/:id` | One card |
| PUT | `/api/cards/:id` | `{ customerUrl }`; empty string deactivates the card |
| DELETE | `/api/cards/:id` | Delete a card |
| GET | `/r/:id` | Public redirect (old codes using `/api/r/:id` still work) |
| GET | `/health` | Health check |
