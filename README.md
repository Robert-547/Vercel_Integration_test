# OrbitOps Vercel test

A small monorepo for testing a deployment platform. It holds:

- `frontend/`: a Next.js app (App Router, TypeScript) that gets deployed to **Vercel**.
- `backend/`: a tiny Express server. It's here so repo analysis detects a backend. It will
  be deployed to **Render** later, but not yet.

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

## Backend (`backend/`)

```bash
cd backend
npm install
npm start        # listens on $PORT, or 4000 if PORT isn't set
```

- `GET /` returns a short text message.
- `GET /health` returns `{ "status": "ok" }`.

## Test plan

- [ ] **1. First deploy.** Connect the repo and deploy `frontend/` to Vercel. Check that the
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
