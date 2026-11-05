export const dynamic = 'force-dynamic';
import mongoose from 'mongoose';
import { route, ok, ApiError, clean } from '@/lib/api';
import { returnSchema } from '@/lib/validations';
import { notify } from '@/lib/orders';
import Order from '@/models/Order';
import ReturnRequest from '@/models/ReturnRequest';

export const POST = route(async ({ req, params, session }) => {
  const d = returnSchema.parse(await req.json());
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Order not found', 404);
  const o = await Order.findOne({ _id: params.id, user: session.user.id });
  if (!o || o.status !== 'delivered') throw new ApiError('Returns can be requested only for delivered orders', 409);
  const deliveredAt = [...o.tracking].reverse().find((t) => t.status === 'delivered')?.at || o.updatedAt;
  if (Date.now() - new Date(deliveredAt).getTime() > 7 * 864e5) throw new ApiError('The 7-day return window for this order has ended', 409);
  if (await ReturnRequest.exists({ order: o._id, status: { $in: ['requested', 'approved', 'received'] } })) throw new ApiError('A return request is already open for this order', 409);
  const valid = new Set(o.items.map((i) => i.productId));
  if (d.items.some((i) => !valid.has(i.productId))) throw new ApiError('Choose items from this order');
  await ReturnRequest.create({ order: o._id, user: session.user.id, items: d.items, reason: clean(d.reason), type: d.type });
  notify(session.user.id, 'Return requested', `We received your request for order ${o.number}.`, '/account?tab=orders');
  return ok({ ok: true, message: 'Request received. We will contact you within one working day.' }, 201);
}, { auth: true, limit: [5, 60_000] });
