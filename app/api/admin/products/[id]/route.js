import { revalidatePath } from 'next/cache';
import { route, ok, ApiError } from '@/lib/api';
import { productSchema } from '@/lib/adminSchemas';
import { toDoc } from '@/lib/productDoc';
import Product from '@/models/Product';

export const PUT = route(async ({ req, params }) => {
  const d = toDoc(productSchema.parse(await req.json()));
  const old = await Product.findOne({ id: params.id });
  if (!old) throw new ApiError('Product not found', 404);
  if (d.slug !== old.slug && (await Product.exists({ slug: d.slug }))) throw new ApiError('That slug is already used by another product', 409);
  Object.assign(old, d);
  await old.save();
  try { revalidatePath(`/product/${old.slug}`); revalidatePath('/shop'); } catch {}
  return ok({ ok: true });
}, { perm: 'products' });

export const DELETE = route(async ({ params }) => {
  const p = await Product.findOneAndDelete({ id: params.id });
  if (p) {
    try { revalidatePath(`/product/${p.slug}`); revalidatePath('/shop'); } catch {}
  }
  return ok({ ok: true });
}, { perm: 'products' });
