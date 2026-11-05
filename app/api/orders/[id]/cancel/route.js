import mongoose from 'mongoose';
import { route, ok, ApiError } from '@/lib/api';
import { restoreStock, notify } from '@/lib/orders';
import { refundPayment } from '@/lib/razorpay';
import Order from '@/models/Order';

export const POST = route(async ({ params, session }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Order not found', 404);
  const o = await Order.findOne({ _id: params.id, user: session.user.id });
  if (!o) throw new ApiError('Order not found', 404);
  if (!['placed', 'confirmed'].includes(o.status)) throw new ApiError('This order has already been packed or shipped. You can request a return after delivery.', 409);
  o.status = 'cancelled';
  o.tracking.push({ status: 'cancelled', note: 'Cancelled by customer' });
  if (o.payment.status === 'paid' && o.payment.razorpayPaymentId) {
    const refunded = await refundPayment(o.payment.razorpayPaymentId, o.total).catch(() => false);
    o.payment.status = refunded ? 'refunded' : 'paid';
    o.tracking.push({ status: 'cancelled', note: refunded ? 'Refund started: 5 to 7 working days' : 'Refund will be processed by our team' });
  }
  await o.save();
  await restoreStock(o.items.map((i) => ({ productId: i.productId, qty: i.qty })));
  notify(o.user, 'Order cancelled', `Order ${o.number} was cancelled.`, '/account?tab=orders');
  return ok({ ok: true, status: o.status, paymentStatus: o.payment.status });
}, { auth: true, limit: [10, 60_000] });
