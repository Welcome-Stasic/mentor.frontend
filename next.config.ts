import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['randomuser.me', 'eriskip.com', 'selstorage.ru', 'avatars.yandex.net'],
  },
  output: 'standalone',
};

export default nextConfig;
