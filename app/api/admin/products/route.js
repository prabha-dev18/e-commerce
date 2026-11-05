export const dynamic = 'force-dynamic';
import { revalidatePath } from 'next/cache';
import { route, ok, ApiError, escapeRegex } from '@/lib/api';
import { productSchema } from '@/lib/adminSchemas';
import { toDoc } from '@/lib/productDoc';
import Product from '@/models/Product';

export const GET = route(async ({ req }) => {
  const sp = req.nextUrl.searchParams;
  const q = (sp.get('q') || '').trim().slice(0, 60);
  const f = {};
  if (q) { const r = new RegExp(escapeRegex(q), 'i'); f.$or = [{ name: r }, { brand: r }, { sku: r }, { id: r }]; }
  if (sp.get('stock') === 'low') f.stock = { $lte: 10 };
  const limit = Math.min(Number(sp.get('limit')) || 20, 100), page = Math.max(Number(sp.get('page')) || 1, 1);
  const [items, total] = await Promise.all([Product.find(f).sort({ created: -1 }).skip((page - 1) * limit).limit(limit).select('-__v').lean(), Product.countDocuments(f)]);
  return ok({ items: items.map(({ _id, ...p }) => p), total, pages: Math.max(Math.ceil(total / limit), 1) });
}, { perm: 'products' });

export const POST = route(async ({ req }) => {
  const d = toDoc(productSchema.parse(await req.json()));
  if (await Product.exists({ slug: d.slug })) throw new ApiError('A product with this name or slug already exists', 409);
  const id = d.slug;
  await Product.create({ ...d, id, sku: `LUM-${Date.now().toString(36).toUpperCase()}`, created: Math.floor(Date.now() / 1000), pop: 0, rating: 0, reviews: 0, tabs: ['new'] });
  try { revalidatePath('/shop'); } catch {}
  return ok({ id }, 201);
}, { perm: 'products', limit: [60, 60_000] });
