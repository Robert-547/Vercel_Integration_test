import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  compiler: {
    // Replaced with a string literal when `next build` runs.
    define: {
      __BUILD_TIME__: new Date().toISOString(),
    },
  },
};

export default nextConfig;
