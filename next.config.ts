import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**", // Mengizinkan semua path di bawah domain ini
      },
    ],
  },
};

export default nextConfig;
