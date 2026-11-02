import Link from "next/link";

export default function About() {
  return (
    <main>
      <h1>About</h1>
      <p>This is the /about route of the OrbitOps Vercel test app. If you can read this, routing works.</p>
      <p>
        <Link href="/">Home</Link>
      </p>
    </main>
  );
}
