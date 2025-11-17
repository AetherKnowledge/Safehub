import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

let supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseURL && supabaseURL.endsWith("/")) {
  supabaseURL = supabaseURL.slice(0, -1);
}

const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "*.googleusercontent.com",
  },
];

if (supabaseURL) {
  remotePatterns.push({
    protocol: "https",
    hostname: supabaseURL.replace(/^https?:\/\//, "").replace(/\/$/, ""),
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  allowedDevOrigins: ["*.jcserver.net"],
};

export default nextConfig;
