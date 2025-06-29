import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['randomuser.me', 'eriskip.com'],
  },
  output: 'standalone',
};

export default nextConfig;
