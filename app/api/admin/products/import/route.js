import { revalidatePath } from 'next/cache';
import { route, ok, ApiError } from '@/lib/api';
import { productSchema } from '@/lib/adminSchemas';
import { parseCsv } from '@/lib/csv';
import { toDoc } from '@/lib/productDoc';
import Product from '@/models/Product';

// CSV columns: name, brand, category, sub, price, mrp, stock, size, images (| separated), description, concern (| separated), skin (| separated), finish, badge, slug
export const POST = route(async ({ req }) => {
  const { csv } = await req.json();
  if (typeof csv !== 'string' || csv.length > 1_500_000) throw new ApiError('Upload a CSV file under 1.5 MB');
  const rows = parseCsv(csv);
  if (!rows.length) throw new ApiError('The file has no rows');
  if (rows.length > 500) throw new ApiError('Import up to 500 products at a time');
  const split = (v) => (v ? v.split('|').map((x) => x.trim()).filter(Boolean) : []);
  let created = 0, updated = 0; const errors = [];
  for (const [i, r] of rows.entries()) {
    try {
      const d = toDoc(productSchema.parse({ ...r, images: split(r.images), concern: split(r.concern), skin: split(r.skin), benefits: [], swatches: [], vegan: true, cf: true, pf: true, active: true }));
      const found = await Product.findOne({ slug: d.slug });
      if (found) { Object.assign(found, d); await found.save(); updated++; }
      else { await Product.create({ ...d, id: d.slug, sku: `LUM-${Date.now().toString(36).toUpperCase()}${i}`, created: Math.floor(Date.now() / 1000), tabs: ['new'] }); created++; }
    } catch (e) { errors.push(`Row ${i + 2}: ${e.issues?.[0] ? `${e.issues[0].path.join('.')} ${e.issues[0].message}` : e.message}`); }
  }
  try { revalidatePath('/shop'); } catch {}
  return ok({ created, updated, failed: errors.length, errors: errors.slice(0, 20) });
}, { perm: 'products', limit: [10, 60_000] });
