import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Allow local uploads folder
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
