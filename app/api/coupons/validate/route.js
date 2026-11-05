export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { route, ok, ApiError } from '@/lib/api';
import { authOptions } from '@/lib/auth';
import { couponSchema } from '@/lib/validations';
import { evaluateCoupon } from '@/lib/coupon';
import Coupon from '@/models/Coupon';
import Product from '@/models/Product';
import Order from '@/models/Order';

// Subtotal is recomputed from database prices (a line may cost up to 2x for value packs). Checkout recomputes again.
export const POST = route(async ({ req }) => {
  const { code, items } = couponSchema.parse(await req.json());
  const coupon = await Coupon.findOne({ code });
  if (!coupon) throw new ApiError('This code is not valid', 404);
  const prods = await Product.find({ id: { $in: items.map((i) => i.id) } }).select('id price').lean();
  const price = Object.fromEntries(prods.map((p) => [p.id, p.price]));
  const subtotal = items.reduce((n, i) => { const db = price[i.id]; return db ? n + Math.min(Math.max(i.price, db), db * 2) * i.qty : n; }, 0);
  const session = await getServerSession(authOptions);
  const isFirstOrder = session?.user?.id ? !(await Order.exists({ user: session.user.id, status: { $ne: 'cancelled' } })) : true;
  const r = evaluateCoupon(coupon, { subtotal, isFirstOrder });
  if (!r.ok) throw new ApiError(r.message, 400);
  return ok({ code: coupon.code, type: coupon.type, value: coupon.value, discount: r.discount, message: r.message });
}, { limit: [20, 60_000] });
