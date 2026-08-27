/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage (fotos dos albuns). Ajuste o host no .env do deploy.
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};

export default nextConfig;
