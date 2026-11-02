import Link from "next/link";

// Bump this to check that push-to-deploy picks up changes.
const VERSION = "v1";

const BUILD_TIME = __BUILD_TIME__;
const COMMIT = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "not from git";

export default function Home() {
  return (
    <main>
      <h1>OrbitOps Vercel test</h1>
      <ul>
        <li>
          Version: <code>{VERSION}</code>
        </li>
        <li>
          Built at: <code>{BUILD_TIME}</code>
        </li>
        <li>
          Commit: <code>{COMMIT}</code>
        </li>
      </ul>
      <p>
        <Link href="/about">About</Link>
      </p>
    </main>
  );
}
