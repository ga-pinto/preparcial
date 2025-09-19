import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "static1.mujerhoy.com",
      },
      {
        protocol: "https",
        hostname: "imagessl.casadellibro.com",
      },
      {
        protocol: "https",
        hostname: "trabalibros.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images.gr-assets.com",
      },
    ],
  },
};

export default nextConfig;
