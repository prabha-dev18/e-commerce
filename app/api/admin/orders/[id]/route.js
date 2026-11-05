import mongoose from 'mongoose';
import { z } from 'zod';
import { route, ok, ApiError, clean } from '@/lib/api';
import { restoreStock, notify, sendOrderMail, markPaid } from '@/lib/orders';
import { refundPayment } from '@/lib/razorpay';
import Order from '@/models/Order';
import User from '@/models/User';

const schema = z.object({ status: z.enum(['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned']).optional(), courier: z.string().trim().max(60).optional(), awb: z.string().trim().max(60).optional(), note: z.string().trim().max(200).optional(), confirmPayment: z.boolean().optional() });
const heading = { shipped: 'Your order has shipped', delivered: 'Your order was delivered', cancelled: 'Your order was cancelled' };

export const GET = route(async ({ params }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Order not found', 404);
  const o = await Order.findById(params.id).populate('user', 'name email phone').lean();
  if (!o) throw new ApiError('Order not found', 404);
  return ok({ order: o });
}, { perm: 'orders' });

export const PATCH = route(async ({ req, params }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Order not found', 404);
  const d = schema.parse(await req.json());
  const o = await Order.findById(params.id).populate('user', 'email');
  if (!o) throw new ApiError('Order not found', 404);
  if (d.confirmPayment) {
    if (o.payment.method !== 'upi' || o.payment.status !== 'pending') throw new ApiError('There is no pending QR payment on this order', 409);
    if (['cancelled', 'returned'].includes(o.status)) throw new ApiError('This order is already closed', 409);
    await markPaid(o, null);
    if (!d.status && !d.courier && !d.awb && !d.note) return ok({ ok: true });
  }
  const prev = o.status;
  if (d.courier !== undefined) o.courier = clean(d.courier);
  if (d.awb !== undefined) o.awb = clean(d.awb);

  if (d.status && d.status !== prev) {
    if (['cancelled', 'returned'].includes(prev)) throw new ApiError('This order is already closed', 409);
    o.status = d.status;
    o.tracking.push({ status: d.status, note: clean(d.note || '') || ({ confirmed: 'Order confirmed', packed: 'Packed and ready to ship', shipped: `Shipped${o.courier ? ` with ${o.courier}` : ''}`, delivered: 'Delivered', cancelled: 'Cancelled by store', returned: 'Return completed' }[d.status]) });
    if (d.status === 'cancelled') {
      await restoreStock(o.items.map((i) => ({ productId: i.productId, qty: i.qty })));
      if (o.payment.status === 'paid' && o.payment.razorpayPaymentId) { const r = await refundPayment(o.payment.razorpayPaymentId, o.total).catch(() => false); if (r) o.payment.status = 'refunded'; else o.tracking.push({ status: 'cancelled', note: 'Refund needs a manual check' }); }
    }
    if (d.status === 'delivered') {
      if (o.payment.method === 'cod' && o.payment.status === 'pending') o.payment.status = 'paid';
      if (o.user && !o.pointsAwarded) { await User.updateOne({ _id: o.user._id }, { $inc: { points: Math.floor(o.total / 10) } }); o.pointsAwarded = true; }
    }
  } else if (d.note) o.tracking.push({ status: o.status, note: clean(d.note) });

  await o.save();
  if (d.status && d.status !== prev) {
    notify(o.user?._id, heading[d.status] || `Order ${d.status}`, `Order ${o.number} is now ${d.status}.`, '/account?tab=orders');
    if (heading[d.status]) sendOrderMail({ ...o.toObject(), email: o.user?.email }, heading[d.status]).catch(console.error);
  }
  return ok({ ok: true });
}, { perm: 'orders' });
