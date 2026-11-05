import mongoose from 'mongoose';
import { route, ok, ApiError } from '@/lib/api';
import { verifySchema } from '@/lib/validations';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { markPaid } from '@/lib/orders';
import Order from '@/models/Order';

export const POST = route(async ({ req }) => {
  const d = verifySchema.parse(await req.json());
  if (!mongoose.isValidObjectId(d.orderId)) throw new ApiError('Order not found', 404);
  const o = await Order.findById(d.orderId);
  if (!o || o.payment.razorpayOrderId !== d.razorpay_order_id) throw new ApiError('Order not found', 404);
  if (!verifyPaymentSignature({ orderId: d.razorpay_order_id, paymentId: d.razorpay_payment_id, signature: d.razorpay_signature })) throw new ApiError('Payment could not be verified', 400);
  await markPaid(o, d.razorpay_payment_id);
  return ok({ ok: true, number: o.number });
}, { limit: [20, 60_000] });
