import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Pastikan Turbopack hanya scan folder project ini
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
