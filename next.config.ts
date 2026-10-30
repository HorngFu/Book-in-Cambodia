import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization costs money on Cloudflare; covers are pre-resized to WebP instead.
  images: { unoptimized: true },
  // app/global-not-found.tsx: one bilingual 404 for every unknown URL.
  experimental: { globalNotFound: true },
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
