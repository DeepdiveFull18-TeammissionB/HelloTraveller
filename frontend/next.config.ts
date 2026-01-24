import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 서버 배포로 전환 (정적 내보내기 비활성화) */
  // output: 'export',
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
