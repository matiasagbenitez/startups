import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "*" },
    ],
  },
  // experimental: {
  //   ppr: 'incremental'
  // },
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
