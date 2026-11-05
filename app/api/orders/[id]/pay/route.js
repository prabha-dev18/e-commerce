export const dynamic = 'force-dynamic';
import mongoose from 'mongoose';
import { route, ok, ApiError } from '@/lib/api';
import { createRazorpayOrder, razorpayReady } from '@/lib/razorpay';
import Order from '@/models/Order';

// Lets a customer finish payment for an online order that is still unpaid.
export const POST = route(async ({ params, session }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Order not found', 404);
  const o = await Order.findOne({ _id: params.id, user: session.user.id });
  if (!o || o.payment.method !== 'razorpay' || o.payment.status !== 'pending' || o.status !== 'placed') throw new ApiError('This order does not need payment', 409);
  let rz;
  if (razorpayReady()) {
    rz = await createRazorpayOrder({ amount: o.total, receipt: o.number });
    o.payment.razorpayOrderId = rz.razorpayOrderId;
    await o.save();
    return ok({ id: String(o._id), number: o.number, total: o.total, razorpay: { orderId: rz.razorpayOrderId, keyId: rz.keyId, amount: rz.amount } });
  } else {
    rz = { mock: true, orderId: `order_mock_${o._id}`, keyId: 'rzp_test_mock', amount: Math.round(o.total * 100) };
    o.payment.razorpayOrderId = rz.orderId;
    await o.save();
    return ok({ id: String(o._id), number: o.number, total: o.total, razorpay: rz });
  }
}, { auth: true, limit: [10, 60_000] });
