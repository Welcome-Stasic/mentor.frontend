import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['randomuser.me', 'eriskip.com', 'selstorage.ru', 'avatars.yandex.net', 'lh3.googleusercontent.com'],
  },
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
};

export default nextConfig;
