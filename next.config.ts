import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Reduce legacy JavaScript by targeting modern browsers
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Experimental: optimize CSS
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
