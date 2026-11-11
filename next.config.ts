import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecom-local.fly.storage.tigris.dev",
      },
      {
        protocol: "https",
        hostname: "ecom-local.t3.tigrisfiles.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
