import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.cloudflarestorage.com",
      },
      // Allow any https domain for flexibility with external image URLs
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
