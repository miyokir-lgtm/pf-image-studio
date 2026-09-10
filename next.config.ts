import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  outputFileTracingIncludes: {
    "/api/prompt": ["./knowledge/**/*"],
  },
};

export default nextConfig;
