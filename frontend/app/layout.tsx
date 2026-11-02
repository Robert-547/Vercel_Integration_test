import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrbitOps Vercel test",
  description: "Minimal Next.js app for testing deployments",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
