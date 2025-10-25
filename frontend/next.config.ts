import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.ikea.com",
        pathname: "/us/en/images/**",
      },
    ],
  },
};

export default nextConfig;
