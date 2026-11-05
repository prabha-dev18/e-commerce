export const dynamic = 'force-dynamic';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { route, ok, ApiError } from '@/lib/api';
import { createUpiQr, findQrPayment, closeUpiQr, razorpayReady, directUpiReady, getDirectUpiVpa, getDirectUpiName } from '@/lib/razorpay';
import { markPaid } from '@/lib/orders';
import { invoiceToken, validInvoiceToken } from '@/lib/invoiceToken';
import Order from '@/models/Order';

// Access: the logged-in owner, or (for guest orders) someone holding the signed token we gave them at checkout.
async function load(params, req) {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Order not found', 404);
  const o = await Order.findById(params.id);
  if (!o || o.payment.method !== 'upi') throw new ApiError('Order not found', 404);
  const session = await getServerSession(authOptions);
  const t = req.nextUrl.searchParams.get('t');
  const owner = o.user && session?.user?.id && String(o.user) === session.user.id;
  const guest = !o.user && validInvoiceToken(o._id, t);
  if (!owner && !guest) throw new ApiError('Order not found', 404);
  return o;
}
const state = (o) => ({ status: o.status === 'cancelled' ? 'cancelled' : o.payment.status, number: o.number, id: String(o._id), t: invoiceToken(o._id), claimed: !!o.payment.utr });

// Polled by the checkout screen every few seconds to see whether the QR has been paid.
export const GET = route(async ({ req, params }) => {
  const o = await load(params, req);
  if (o.payment.status === 'pending' && o.status === 'placed' && o.payment.qrId && razorpayReady()) {
    const p = await findQrPayment(o.payment.qrId, o.total);
    if (p) await markPaid(o, p.id);
  }
  return ok(state(o));
}, { limit: [60, 60_000] });

// Creates (or re-uses) the QR code to show the customer.
export const POST = route(async ({ req, params }) => {
  const o = await load(params, req);
  if (o.payment.status !== 'pending' || o.status !== 'placed') throw new ApiError('This order does not need payment', 409);

  if (razorpayReady()) {
    const live = o.payment.qrId && o.payment.qrImage && o.payment.qrExpiresAt && o.payment.qrExpiresAt.getTime() > Date.now() + 60_000;
    if (!live) {
      if (o.payment.qrId) closeUpiQr(o.payment.qrId);
      const qr = await createUpiQr({ amount: o.total, receipt: o.number });
      o.payment.qrId = qr.qrId; o.payment.qrImage = qr.imageUrl; o.payment.qrExpiresAt = qr.expiresAt;
      await o.save();
    }
    return ok({ mode: 'razorpay', imageUrl: o.payment.qrImage, expiresAt: o.payment.qrExpiresAt, amount: o.total, ...state(o) });
  }
  const vpa = getDirectUpiVpa(), name = getDirectUpiName();
  const link = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&am=${o.total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order ${o.number}`)}&tr=${encodeURIComponent(o.number)}`;
  return ok({ mode: 'direct', link, vpa, payeeName: name, amount: o.total, expiresAt: new Date(Date.now() + 30 * 60_000), ...state(o) });
}, { limit: [20, 60_000] });
