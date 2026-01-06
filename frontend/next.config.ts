import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vapor UI 번들 최적화 설정 */
  experimental: {
    optimizePackageImports: ['@vapor-ui/core', '@vapor-ui/icons'],
  },
};

export default nextConfig;
