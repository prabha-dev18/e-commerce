import mongoose from 'mongoose';
import { z } from 'zod';
import { route, ok, ApiError } from '@/lib/api';
import { refundPayment } from '@/lib/razorpay';
import { restoreStock, notify } from '@/lib/orders';
import ReturnRequest from '@/models/ReturnRequest';
import Order from '@/models/Order';

const next = { requested: ['approved', 'rejected'], approved: ['received', 'rejected'], received: ['refunded'], rejected: [], refunded: [] };

export const PATCH = route(async ({ req, params }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Request not found', 404);
  const { status } = z.object({ status: z.enum(['approved', 'rejected', 'received', 'refunded']) }).parse(await req.json());
  const r = await ReturnRequest.findById(params.id);
  if (!r) throw new ApiError('Request not found', 404);
  if (!next[r.status].includes(status)) throw new ApiError(`A ${r.status} request cannot move to ${status}`, 409);
  const o = await Order.findById(r.order);
  if (status === 'received' && o) await restoreStock(r.items.map((i) => ({ productId: i.productId, qty: i.qty })));
  if (status === 'refunded' && o) {
    const part = o.items.filter((i) => r.items.some((x) => x.productId === i.productId)).reduce((n, i) => n + i.price * (r.items.find((x) => x.productId === i.productId)?.qty || i.qty), 0);
    if (o.payment.status === 'paid' && o.payment.method === 'razorpay' && o.payment.razorpayPaymentId) {
      if (!(await refundPayment(o.payment.razorpayPaymentId, part || o.total).catch(() => false))) throw new ApiError('Razorpay did not accept the refund. Refund it from the Razorpay dashboard, then try again.', 502);
    }
    o.tracking.push({ status: o.status, note: `Refund of ₹${part || o.total} started` });
    if (r.items.length === o.items.length) { o.status = 'returned'; o.payment.status = 'refunded'; }
    await o.save();
  }
  r.status = status; await r.save();
  notify(r.user, `Return ${status}`, `Your request for order ${o?.number || ''} is now ${status}.`, '/account?tab=orders');
  return ok({ ok: true });
}, { perm: 'returns' });
