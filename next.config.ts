import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Pin the workspace root to this repo. Without it, Turbopack walks up and
  // finds a stray package-lock.json in the home dir and guesses wrong.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
