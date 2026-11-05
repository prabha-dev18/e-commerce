export const dynamic = 'force-dynamic';
import { route, ok, ApiError, clean } from '@/lib/api';
import { orderSchema } from '@/lib/validations';
import { priceOrder } from '@/lib/pricing';
import { genNumber, reserveStock, restoreStock, sendOrderMail, notify } from '@/lib/orders';
import { createRazorpayOrder, upiReady, razorpayReady } from '@/lib/razorpay';
import { invoiceToken } from '@/lib/invoiceToken';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import Address from '@/models/Address';
import User from '@/models/User';

export const GET = route(async ({ session }) => {
  const list = await Order.find({ user: session.user.id }).sort({ createdAt: -1 }).limit(50).lean();
  const orders = list.map((o) => ({ ...o, t: invoiceToken(o._id) }));
  return ok({ orders });
}, { auth: true });

export const POST = route(async ({ req, session }) => {
  const d = orderSchema.parse(await req.json());
  const userId = session?.user?.id;
  const email = userId ? undefined : d.email;
  if (!userId && !email) throw new ApiError('Enter your email so we can send the order confirmation');

  const q = await priceOrder({ items: d.items, couponCode: d.couponCode || undefined, shippingMethod: d.shippingMethod, userId });
  if (d.paymentMethod === 'cod' && !q.codEnabled) throw new ApiError('Cash on delivery is not available right now');
  if (d.paymentMethod === 'upi' && !upiReady()) throw new ApiError('QR payment is not set up yet. Please choose another payment method.', 503);

  const short = await reserveStock(q.lines);
  if (short) throw new ApiError(`${short.name} just went out of stock. Please update your bag.`, 409);

  const a = d.address;
  let order;
  try {
    order = await Order.create({
      number: genNumber(), user: userId, guestEmail: email,
      items: q.lines,
      address: { name: clean(a.name), phone: a.phone, line1: clean(a.line1), line2: clean(a.line2 || ''), city: clean(a.city), state: clean(a.state), pincode: a.pincode },
      gstin: d.gstin || undefined, shippingMethod: d.shippingMethod,
      payment: { method: d.paymentMethod, status: 'pending' },
      coupon: q.couponCode ? { code: q.couponCode, discount: q.discount } : undefined,
      subtotal: q.subtotal, shipping: q.shipping, tax: q.tax, total: q.total,
      status: 'placed', tracking: [{ status: 'placed', note: 'Order placed' }],
    });
    let rz = null;
    if (d.paymentMethod === 'razorpay') {
      if (razorpayReady()) {
        rz = await createRazorpayOrder({ amount: q.total, receipt: order.number });
        order.payment.razorpayOrderId = rz.razorpayOrderId;
        await order.save();
      } else {
        rz = { mock: true, razorpayOrderId: `order_mock_${order._id}`, keyId: 'rzp_test_mock', amount: Math.round(q.total * 100) };
        order.payment.razorpayOrderId = rz.razorpayOrderId;
        await order.save();
      }
    }
    if (q.couponCode) await Coupon.updateOne({ code: q.couponCode }, { $inc: { usedCount: 1 } });
    if (userId && d.saveAddress && (await Address.countDocuments({ user: userId })) < 10) await Address.create({ user: userId, ...order.address.toObject(), label: 'Home' });

    if (d.paymentMethod === 'cod') {
      const to = email || (await User.findById(userId).select('email').lean())?.email;
      sendOrderMail({ ...order.toObject(), email: to }).catch(console.error);
      notify(userId, 'Order placed', `Order ${order.number} is placed. Pay on delivery.`, '/account?tab=orders');
    }
    return ok({ id: String(order._id), t: invoiceToken(order._id), number: order.number, total: order.total, method: d.paymentMethod, razorpay: rz ? { orderId: rz.razorpayOrderId, keyId: rz.keyId, amount: rz.amount, mock: !!rz.mock } : null }, 201);
  } catch (e) {
    await restoreStock(q.lines);
    if (order) await Order.deleteOne({ _id: order._id });
    throw e;
  }
}, { optionalAuth: true, limit: [10, 60_000] });
