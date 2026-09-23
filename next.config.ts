import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog/what-is-jev-ai-model-saas-founders",
        destination: "/blog/what-is-jev-ai",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
