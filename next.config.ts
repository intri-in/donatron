import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
 allowedDevOrigins: ['localhost'],

};

export default nextConfig;
