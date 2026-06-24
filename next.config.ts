import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise le chargement des visuels produits depuis le CDN TCGPlayer.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tcgplayer-cdn.tcgplayer.com",
      },
    ],
  },
};

export default nextConfig;
