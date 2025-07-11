import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ignite-db.t3.storage.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ignite-db.fly.storage.tigris.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
