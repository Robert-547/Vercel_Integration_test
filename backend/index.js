const express = require("express");
const cors = require("cors");

// Bump this (e.g. to "v2") and redeploy to check that a new deploy goes live.
const VERSION = "v1";

const PORT = Number(process.env.PORT) || 4000;
// Render only routes traffic to services bound to 0.0.0.0.
const HOST = "0.0.0.0";

const app = express();

// Allow any origin so the Vercel frontend can call this later.
app.use(cors());

// Render health check path.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "OrbitOps test backend is running",
    version: VERSION,
    greeting: process.env.GREETING ?? "no GREETING set",
    commit: (process.env.RENDER_GIT_COMMIT ?? "local").slice(0, 7),
    node: process.version,
    uptimeSeconds: Math.round(process.uptime()),
  });
});

app.get("/api/time", (req, res) => {
  res.status(200).json({ now: new Date().toISOString() });
});

// Anything else.
app.use((req, res) => {
  res.status(404).json({ error: "not_found" });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`listening on http://${HOST}:${PORT}`);
});

// Render sends SIGTERM before stopping an instance (redeploys, scale-downs).
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server");
  server.close(() => process.exit(0));
});
