export const dynamic = 'force-dynamic';
import { route, ok, escapeRegex } from '@/lib/api';
import Product from '@/models/Product';

const list = (v) => (v ? String(v).split(',').filter(Boolean) : []);
const SHADES = { Light: '#F1D3B8', Medium: '#E3B999', Tan: '#C99772', Deep: '#9C6B4A', Nude: '#C9877A', Rose: '#B98282', Berry: '#9C5B5B', Brown: '#7A3E3E' };
const SORT = { popularity: { pop: -1 }, newest: { created: -1 }, 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, rating: { rating: -1, reviews: -1 } };
const PUBLIC = '-_id -__v -createdAt -updatedAt -active -seo -description -ingredients -howTo -benefits';

export const GET = route(async ({ req }) => {
  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const f = { active: true };
  const q = (sp.q || '').trim().slice(0, 60);
  if (q) { const r = new RegExp(escapeRegex(q), 'i'); f.$or = [{ name: r }, { brand: r }, { category: r }, { sub: r }]; }
  if (sp.ids) f.id = { $in: list(sp.ids).slice(0, 50) };
  const inList = (field, key) => { const v = list(sp[key]); if (v.length) f[field] = { $in: v }; };
  inList('category', 'category'); inList('sub', 'sub'); inList('brand', 'brand'); inList('skin', 'skin'); inList('concern', 'concern'); inList('finish', 'finish'); inList('sizeBucket', 'size');
  const hexes = list(sp.shade).map((n) => SHADES[n]).filter(Boolean);
  if (hexes.length) f.swatches = { $in: hexes };
  const min = Number(sp.min), max = Number(sp.max);
  if (min || max) f.price = { ...(min && { $gte: min }), ...(max && { $lte: max }) };
  if (sp.rating) f.rating = { $gte: Number(sp.rating) };
  if (sp.discount) f.discount = { $gte: Number(sp.discount) };
  if (sp.stock === '1') f.stock = { $gt: 0 };
  ['vegan', 'cf', 'pf'].forEach((k) => { if (sp[k] === '1') f[k] = true; });

  const limit = Math.min(Math.max(Number(sp.limit) || 9, 1), 48);
  const page = Math.max(Number(sp.page) || 1, 1);
  const [items, total] = await Promise.all([
    Product.find(f).select(PUBLIC).sort(SORT[sp.sort] || SORT.popularity).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(f),
  ]);
  return ok({ items, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
});
