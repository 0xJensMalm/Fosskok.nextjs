import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configure cache settings to prevent excessive caching
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
  // Ensure all pages are server-side rendered
  reactStrictMode: true,
};

export default nextConfig;
