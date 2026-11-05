import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Page from '@/models/Page';
import { catalog } from '@/lib/catalog';
import { loadPosts } from '@/lib/blogSource';

export const revalidate = 3600;
const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

export default async function sitemap() {
  const now = new Date();
  const fixed = ['', '/shop', '/brands', '/blog', '/about', '/contact', '/faq', '/stores', '/privacy', '/terms', '/returns', '/shipping-policy', '/track-order'].map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: p === '' || p === '/shop' ? 'daily' : 'monthly', priority: p === '' ? 1 : p === '/shop' ? 0.9 : 0.5 }));
  let products = catalog.map((p) => ({ slug: p.slug, updatedAt: now })), pages = [];
  try {
    await Promise.race([connectDB(), timeout(3000)]);
    const [db, cms] = await Promise.all([Product.find({ active: true }).select('slug updatedAt').lean(), Page.find({ published: true }).select('slug updatedAt').lean()]);
    if (db.length) products = db;
    pages = cms;
  } catch { /* fall back to bundled products */ }
  const posts = await loadPosts();
  return [
    ...fixed,
    ...['skincare', 'makeup', 'hair', 'fragrance', 'bath-body', 'mens-grooming', 'gift-sets'].map((c) => ({ url: `${base}/shop?category=${c}`, lastModified: now, changeFrequency: 'daily', priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: p.updatedAt || now, changeFrequency: 'weekly', priority: 0.7 })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: 'monthly', priority: 0.6 })),
    ...pages.map((p) => ({ url: `${base}/p/${p.slug}`, lastModified: p.updatedAt || now, changeFrequency: 'monthly', priority: 0.4 })),
  ];
}
