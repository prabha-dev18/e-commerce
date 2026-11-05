export const dynamic = 'force-dynamic';
import bcrypt from 'bcryptjs';
import { route, ok, ApiError } from '@/lib/api';
import { catalog, facets, details } from '@/lib/catalog';
import { slides } from '@/data/home';
import { blogPosts } from '@/data/blog';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Brand from '@/models/Brand';
import Coupon from '@/models/Coupon';
import Banner from '@/models/Banner';
import BlogPost from '@/models/BlogPost';
import Settings from '@/models/Settings';
import User from '@/models/User';

const bucket = (p) => { const n = parseFloat(p.size); return n < 50 ? 'small' : n <= 150 ? 'medium' : 'large'; };
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Disabled unless SEED_SECRET is set, and the caller must send it. Safe to run more than once (upserts).
export const POST = route(async ({ req }) => {
  const secret = process.env.SEED_SECRET;
  if (!secret || req.headers.get('x-seed-secret') !== secret) throw new ApiError('Not allowed', 403);

  await Promise.all(catalog.map((p) => {
    const d = details(p);
    const doc = { ...p, description: d.description, ingredients: d.ingredients, howTo: d.howTo, benefits: d.benefits, discount: p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0, sizeBucket: bucket(p), active: true };
    return Product.updateOne({ id: p.id }, { $set: doc }, { upsert: true });
  }));
  await Promise.all(facets.category.map(([s, name], i) => Category.updateOne({ slug: s }, { $set: { slug: s, name, order: i, active: true } }, { upsert: true })));
  await Promise.all(facets.brand.map(([name]) => Brand.updateOne({ slug: slug(name) }, { $set: { slug: slug(name), name, active: true } }, { upsert: true })));
  await Promise.all(slides.map((s, i) => Banner.updateOne({ title: s.title }, { $set: { title: s.title, text: s.text, cta: s.cta, href: s.href, image: s.image, tone: s.tone, order: i, placement: 'hero', active: true } }, { upsert: true })));
  await Promise.all(blogPosts.map((p) => BlogPost.updateOne({ slug: p.slug }, { $set: { slug: p.slug, title: p.title, image: p.image, tone: p.tone, readTime: p.readTime, excerpt: p.excerpt, body: p.body, publishedAt: new Date(p.date), published: true } }, { upsert: true })));
  const coupons = [
    { code: 'WELCOME10', description: '10% off your first order', type: 'percent', value: 10, maxDiscount: 300, firstOrderOnly: true },
    { code: 'GLOW200', description: '₹200 off above ₹1,999', type: 'flat', value: 200, minOrder: 1999 },
    { code: 'UPI50', description: '₹50 off on UPI payments', type: 'flat', value: 50, minOrder: 499 },
  ];
  await Promise.all(coupons.map((c) => Coupon.updateOne({ code: c.code }, { $set: { ...c, active: true } }, { upsert: true })));
  await Settings.updateOne({ key: 'store' }, { $setOnInsert: { key: 'store', storeName: 'Lumière', email: 'care@lumiere.in', phone: '+91 99999 99999' } }, { upsert: true });

  const email = (process.env.ADMIN_EMAIL || 'admin@lumiere.in').toLowerCase();
  const exists = await User.exists({ email });
  if (!exists) await User.create({ name: 'Store Admin', email, role: 'admin', emailVerified: true, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeMe@123', 12) });
  return ok({ ok: true, products: catalog.length, coupons: coupons.length, adminCreated: !exists, adminEmail: email });
}, { limit: [5, 60_000] });
