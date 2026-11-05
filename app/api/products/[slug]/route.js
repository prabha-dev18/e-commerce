export const dynamic = 'force-dynamic';
import { route, ok, ApiError } from '@/lib/api';
import Product from '@/models/Product';

export const GET = route(async ({ params }) => {
  const p = await Product.findOne({ slug: params.slug, active: true }).select('-_id -__v').lean();
  if (!p) throw new ApiError('Product not found', 404);
  const related = await Product.find({ active: true, id: { $ne: p.id }, $or: [{ category: p.category }, { brand: p.brand }] }).select('-_id -__v -description -ingredients -howTo -benefits').limit(8).lean();
  return ok({ product: p, related });
});
