import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["mammoth", "pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
