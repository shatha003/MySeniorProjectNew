import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable API routes for chat functionality
  // Static export is disabled to support API routes
  // Use 'next start' or 'next dev' to run the server

  // Environment variables (these need to be set in .env.local)
  env: {
    // OPENROUTER_API_KEY is required - set in .env.local
  },

  // Images configuration (if needed)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
