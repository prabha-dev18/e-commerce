const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/account', '/checkout', '/cart', '/login', '/register', '/forgot-password', '/reset-password', '/order-success', '/search', '/wishlist', '/compare'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
