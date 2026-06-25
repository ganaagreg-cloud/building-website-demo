import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    quality: 90,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
