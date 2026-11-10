import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Endereços antigos (antes das duas regiões) levam ao Scaffid II.
  async redirects() {
    return ["inscricao", "votar", "casas", "resultado", "regulamento", "contestacao"].flatMap((p) => [
      { source: `/${p}`, destination: `/scaffid-ii/${p}`, permanent: false },
      { source: `/${p}/:resto*`, destination: `/scaffid-ii/${p}/:resto*`, permanent: false },
    ]);
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
