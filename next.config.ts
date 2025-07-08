import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['randomuser.me', 'eriskip.com', 'selstorage.ru'],
  },
  output: 'standalone',
};

export default nextConfig;
