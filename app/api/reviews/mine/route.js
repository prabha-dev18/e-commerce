export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';
import Review from '@/models/Review';
import Product from '@/models/Product';

export const GET = route(async ({ session }) => {
  const rs = await Review.find({ user: session.user.id }).sort({ createdAt: -1 }).lean();
  const prods = await Product.find({ id: { $in: rs.map((r) => r.productId) } }).select('id name slug').lean();
  const by = Object.fromEntries(prods.map((p) => [p.id, p]));
  return ok({ items: rs.map((r) => ({ id: String(r._id), rating: r.rating, text: r.text, status: r.status, at: r.createdAt, product: by[r.productId] ? { name: by[r.productId].name, slug: by[r.productId].slug } : null })) });
}, { auth: true });
