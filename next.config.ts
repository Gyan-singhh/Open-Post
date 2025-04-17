import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
    remotePatterns: [
      new URL("https://res.cloudinary.com/dccgxueof/image/upload/**"),
    ],
  },
};

export default nextConfig;
