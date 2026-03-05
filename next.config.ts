import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "img.icons8.com"],
  },
  async rewrites() {
    const apiUrl = process.env.QWORK_API_URL || "http://localhost:3001";
    return [
      {
        source: "/api/public/:path*",
        destination: `${apiUrl}/api/public/:path*`,
      },
    ];
  },
};

export default nextConfig;
