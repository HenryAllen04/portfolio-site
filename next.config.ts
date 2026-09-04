import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The writings index lives on the one-page home
      { source: "/writing", destination: "/#writings", permanent: false },
      // Old experience-page URL now lives in the essay system
      {
        source: "/the20hr-co",
        destination: "/writing/the20hr-co",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
