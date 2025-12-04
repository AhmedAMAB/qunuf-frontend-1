import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081",
        pathname: "/uploads/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/en/dashboard',
        destination: '/en/dashboard/tenant',
        permanent: true,
      },
      {
        source: '/ar/dashboard',
        destination: '/ar/dashboard/tenant',
        permanent: true
      }
    ]
  },
};

export default withNextIntl(nextConfig);

