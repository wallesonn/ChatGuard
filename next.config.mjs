/** @type {import('next').NextConfig} */
// Página estática primeiro: pré-renderizada no build (SSG). Sem backend, API ou rotas dinâmicas.
const nextConfig = {
  output: 'export',
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
