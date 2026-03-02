import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["mammoth", "pdf-parse"],
};

export default nextConfig;
