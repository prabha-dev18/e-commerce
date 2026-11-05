import mongoose from 'mongoose';
import { route, ok, ApiError } from '@/lib/api';
import { restoreStock } from '@/lib/orders';
import { closeUpiQr } from '@/lib/razorpay';
import Order from '@/models/Order';

// Called when a guest closes the payment window. Releases the reserved stock. Needs the Razorpay order id as proof.
export const POST = route(async ({ req }) => {
  const { orderId, razorpayOrderId } = await req.json();
  if (!mongoose.isValidObjectId(orderId)) throw new ApiError('Order not found', 404);
  const proof = razorpayOrderId ? { 'payment.razorpayOrderId': razorpayOrderId } : { 'payment.method': 'upi', 'payment.utr': { $exists: false } };
  const o = await Order.findOne({ _id: orderId, ...proof, 'payment.status': 'pending', status: 'placed', user: { $exists: false } });
  if (!o) return ok({ ok: true });
  o.status = 'cancelled'; o.tracking.push({ status: 'cancelled', note: 'Payment not completed' });
  await o.save();
  if (o.payment.qrId) closeUpiQr(o.payment.qrId);
  await restoreStock(o.items.map((i) => ({ productId: i.productId, qty: i.qty })));
  return ok({ ok: true });
}, { limit: [10, 60_000] });
