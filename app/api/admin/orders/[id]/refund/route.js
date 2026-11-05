export const dynamic = 'force-dynamic';
import mongoose from 'mongoose';
import { route, ok, ApiError } from '@/lib/api';
import { refundPayment } from '@/lib/razorpay';
import { notify } from '@/lib/orders';
import Order from '@/models/Order';

export const POST = route(async ({ params, session }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Order not found', 404);
  const o = await Order.findById(params.id);
  if (!o) throw new ApiError('Order not found', 404);
  if (o.payment.status !== 'paid') throw new ApiError('Only paid orders can be refunded', 409);
  if (o.payment.method === 'razorpay' && o.payment.razorpayPaymentId) {
    if (!(await refundPayment(o.payment.razorpayPaymentId, o.total).catch(() => false))) throw new ApiError('Razorpay did not accept the refund. Check the payment in your Razorpay dashboard.', 502);
    o.tracking.push({ status: o.status, note: 'Refund started: 5 to 7 working days' });
  } else o.tracking.push({ status: o.status, note: 'Refund marked as given (cash order)' });
  o.payment.status = 'refunded';
  await o.save();
  notify(o.user, 'Refund started', `Your refund for order ${o.number} has been started.`, '/account?tab=orders');
  return ok({ ok: true });
}, { perm: 'orders', limit: [20, 60_000] });
