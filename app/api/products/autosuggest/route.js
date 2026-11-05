import { route, ok, escapeRegex } from '@/lib/api';
import Product from '@/models/Product';

export const GET = route(async ({ req }) => {
  const q = (req.nextUrl.searchParams.get('q') || '').trim().slice(0, 40);
  if (q.length < 2) return ok({ suggestions: [] });
  const r = new RegExp(escapeRegex(q), 'i');
  const items = await Product.find({ active: true, $or: [{ name: r }, { brand: r }, { sub: r }] }).select('name slug image price -_id').sort({ pop: -1 }).limit(6).lean();
  return ok({ suggestions: items });
}, { limit: [60, 60_000] });
