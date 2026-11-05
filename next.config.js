/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  staticPageGenerationTimeout: 180,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: { optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'] },
  images: { remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }, { protocol: 'https', hostname: 'images.unsplash.com' }] },
  async headers() { return [{ source: '/:path*', headers: securityHeaders }]; },
};
module.exports = nextConfig;
