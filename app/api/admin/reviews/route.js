export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';
import Review from '@/models/Review';
import Product from '@/models/Product';

export const GET = route(async ({ req }) => {
  const sp = req.nextUrl.searchParams;
  const f = sp.get('status') ? { status: sp.get('status') } : {};
  const limit = 20, page = Math.max(Number(sp.get('page')) || 1, 1);
  const [items, total] = await Promise.all([Review.find(f).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Review.countDocuments(f)]);
  const prods = await Product.find({ id: { $in: items.map((r) => r.productId) } }).select('id name').lean();
  const by = Object.fromEntries(prods.map((p) => [p.id, p.name]));
  return ok({ items: items.map((r) => ({ id: String(r._id), productId: r.productId, product: by[r.productId] || r.productId, name: r.name, rating: r.rating, text: r.text, status: r.status, verified: r.verified, createdAt: r.createdAt })), total, pages: Math.max(Math.ceil(total / limit), 1) });
}, { perm: 'reviews' });
