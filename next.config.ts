import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Génère un dossier 'out' lors du build
  images: {
    unoptimized: true, // Requis pour l'export statique
  },
};

export default nextConfig;
