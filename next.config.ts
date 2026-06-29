import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "janet-lee-v2.local"
      },
      {
        protocol: "https",
        hostname: "janetleedesignstudio.com"
      }
    ]
  }
};

export default nextConfig;
