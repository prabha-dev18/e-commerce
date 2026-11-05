export const dynamic = 'force-dynamic';
import { route, ok, ApiError, clean } from '@/lib/api';
import { reviewSchema } from '@/lib/validations';
import Review from '@/models/Review';
import Order from '@/models/Order';
import User from '@/models/User';

export const GET = route(async ({ req }) => {
  const productId = req.nextUrl.searchParams.get('productId');
  if (!productId) throw new ApiError('productId is required');
  const items = await Review.find({ productId, status: 'approved' }).sort({ helpful: -1, createdAt: -1 }).limit(50).select('name rating text verified helpful createdAt').lean();
  return ok({ items: items.map((r) => ({ id: String(r._id), name: r.name, rating: r.rating, text: r.text, verified: r.verified, helpful: r.helpful, date: new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) })) });
});

// Only customers who received this product can review it; reviews wait for moderation.
export const POST = route(async ({ req, session }) => {
  const { productId, rating, text } = reviewSchema.parse(await req.json());
  const bought = await Order.exists({ user: session.user.id, status: 'delivered', 'items.productId': productId });
  if (!bought) throw new ApiError('Only verified buyers can review this product', 403);
  if (await Review.exists({ productId, user: session.user.id })) throw new ApiError('You have already reviewed this product', 409);
  const u = await User.findById(session.user.id).select('name');
  await Review.create({ productId, user: session.user.id, name: clean(u?.name || 'Customer'), rating, text: clean(text), verified: true, status: 'pending' });
  return ok({ ok: true, message: 'Thanks. Your review will appear once approved.' }, 201);
}, { auth: true, limit: [10, 60_000] });
