import { route, ok, ApiError } from '@/lib/api';
import { trackSchema } from '@/lib/validations';
import Order from '@/models/Order';

// Guests prove ownership with order number + email. Only non-sensitive fields are returned.
export const POST = route(async ({ req }) => {
  const { number, email } = trackSchema.parse(await req.json());
  const o = await Order.findOne({ number }).populate('user', 'email').lean();
  const owner = (o?.guestEmail || o?.user?.email || '').toLowerCase();
  if (!o || owner !== email) throw new ApiError('We could not find an order with those details', 404);
  return ok({ order: { number: o.number, status: o.status, createdAt: o.createdAt, total: o.total, items: o.items.map((i) => ({ name: i.name, qty: i.qty, variant: i.variant, image: i.image })), tracking: o.tracking, courier: o.courier, awb: o.awb, city: o.address.city, payment: { method: o.payment.method, status: o.payment.status } } });
}, { limit: [10, 60_000] });
