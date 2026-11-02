# OrbitOps Vercel test

A small monorepo for testing a deployment platform. It holds:

- `frontend/`: a Next.js app (App Router, TypeScript) that gets deployed to **Vercel**.
- `backend/`: a tiny Express server (plain JavaScript, CommonJS, no build step) that gets
  deployed to **Render**.

There's no root `package.json` and no workspaces. Each folder has its own `package.json` and
`package-lock.json`, and they're installed and built separately.

## Frontend (`frontend/`)

The home page shows:

- a `VERSION` constant (in `frontend/app/page.tsx`) that you can bump,
- the build time, set once when `next build` runs (`compiler.define` in `next.config.ts`),
- the deployed commit, which is the first 7 characters of `VERCEL_GIT_COMMIT_SHA`, or `not from git`.

`/about` is a second route so you can check that routing works.

The frontend needs no environment variables.

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Backend (`backend/`)## Backend (Render test)

Lives in `backend/`. Express + `cors`, Node 20 or newer, no TypeScript and no build step.

### Run it locally

```bash
cd backend
npm install
npm start        # listens on 0.0.0.0:$PORT, or 0.0.0.0:4000 if PORT isn't set
npm run dev      # same, restarts when files change (node --watch)
```

On startup it logs one line, e.g. `listening on http://0.0.0.0:4000`. It binds to `0.0.0.0`
because Render only routes traffic there, and it closes the server cleanly on `SIGTERM`.

Environment variables (all optional, there is no `.env.example` on purpose):

- `PORT`: set by Render. Defaults to `4000`.
- `GREETING`: shown by `GET /`. Defaults to `no GREETING set`.
- `RENDER_GIT_COMMIT`: set by Render. `GET /` shows its first 7 characters, or `local`.

### Routes

CORS is enabled for any origin, so the Vercel frontend can call these later.

| Route           | Response                                                          |
| --------------- | ----------------------------------------------------------------- |
| `GET /health`   | `200 { "status": "ok" }` (Render health check path)               |
| `GET /`         | `200 { message, version, greeting, commit, node, uptimeSeconds }` |
| `GET /api/time` | `200 { "now": "<ISO timestamp>" }`                                |
| anything else   | `404 { "error": "not_found" }`                                    |

`version` comes from the `VERSION` constant near the top of `backend/index.js`.

### What to enter on the platform's Backend card

| Field             | Value         |
| ----------------- | ------------- |
| Root folder       | `backend`     |
| Framework         | `express`     |
| Install command   | `npm install` |
| Build command     | *(leave empty)* |
| Start command     | `npm start`   |
| Health check path | `/health`     |

### Backend test checklist

- [ ] **B1. First deploy.** Deploy `backend/` to Render with the settings above. Check that
      `GET /health` returns `{ "status": "ok" }` and `GET /` shows `"version": "v1"`, a
      7-character `commit` and `"greeting": "no GREETING set"`. Check `GET /api/time` and that
      an unknown path returns a 404 with `{ "error": "not_found" }`.
- [ ] **B2. Environment variable.** Set `GREETING=hi` on the project and redeploy. Check that
      `GET /` shows `"greeting": "hi"`.
- [ ] **B3. Push-to-deploy.** Bump `VERSION` in `backend/index.js` (for example to `"v2"`),
      then commit and push (or redeploy). Check that `GET /` shows the new version and commit.
- [ ] **B4. Broken start command.** Change the start command on purpose to something that
      fails (for example `npm run does-not-exist`) and redeploy. Check that the failure message
      is clear and the last good deployment keeps serving. Then put `npm start` back.

. First deploy.** Connect the repo and deploy `frontend/` to Vercel. Check that the
      home page shows `v1`, a build time, and a 7-character commit SHA, and that `/about` loads.
- [ ] **2. Push-to-deploy.** Change `VERSION` in `frontend/app/page.tsx` (for example to `"v2"`),
      then commit and push. Check that a new deployment starts on its own and that the page
      shows the new version, build time and commit.
- [ ] **3. Backend-only change.** Change only a file in `backend/` (for example the `GET /`
      message), then commit and push. Check that the frontend is **not** redeployed (its build
      time and commit stay the same).
- [ ] **4. Broken build.** In the platform's UI, change the frontend build command to something
      that fails (for example `npm run does-not-exist`) and redeploy. Check that the failure is
      reported clearly and the last good deployment keeps serving. Then put the build command
      back.
