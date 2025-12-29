import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['randomuser.me', 'eriskip.com', 'selstorage.ru', 'avatars.yandex.net', 'lh3.googleusercontent.com'],
  },
  output: 'standalone',
  productionBrowserSourceMaps: false,
};

export default nextConfig;
