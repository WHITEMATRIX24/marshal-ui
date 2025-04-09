import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "marshaldoc.s3.ap-northeast-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
