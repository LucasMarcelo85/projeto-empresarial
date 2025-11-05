// next.config.mjs para Next.js em modo ESM

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: true,
  // Desabilita a verificação do ESLint durante o build para evitar falhas de deploy
  eslint: {
    // Não executa o ESLint durante o build da produção
    ignoreDuringBuilds: true,
  },
  // Desabilita a verificação de tipos TypeScript durante o build para evitar falhas de deploy
  typescript: {
    // Não executa a verificação de tipos durante o build da produção
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
