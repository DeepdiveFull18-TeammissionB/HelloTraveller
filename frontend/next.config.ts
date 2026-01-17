import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* S3 정적 배포를 위한 설정 */
  /* 서버 배포로 전환 */
  images: {
    unoptimized: true,
  },
  /* Vapor UI 번들 최적화 설정 */
  experimental: {
    optimizePackageImports: ['@vapor-ui/core', '@vapor-ui/icons'],
  },
};

export default nextConfig;
