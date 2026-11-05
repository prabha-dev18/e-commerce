import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { route, ok, ApiError } from '@/lib/api';
import { utrSchema } from '@/lib/validations';
import { notify } from '@/lib/orders';
import { validInvoiceToken } from '@/lib/invoiceToken';
import Order from '@/models/Order';

// Direct-UPI mode only: the customer enters the 12-digit UTR from their app. A team member then confirms it in the admin panel.
export const POST = route(async ({ req, params }) => {
  const { utr } = utrSchema.parse(await req.json());
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Order not found', 404);
  const o = await Order.findById(params.id);
  if (!o || o.payment.method !== 'upi') throw new ApiError('Order not found', 404);
  const session = await getServerSession(authOptions);
  const owner = o.user && session?.user?.id && String(o.user) === session.user.id;
  const guest = !o.user && validInvoiceToken(o._id, req.nextUrl.searchParams.get('t'));
  if (!owner && !guest) throw new ApiError('Order not found', 404);
  if (o.payment.status !== 'pending') throw new ApiError('This order is already paid', 409);
  if (await Order.exists({ 'payment.utr': utr, _id: { $ne: o._id } })) throw new ApiError('This reference number was already used on another order', 409);
  o.payment.utr = utr; o.payment.utrAt = new Date();
  o.tracking.push({ status: o.status, note: `UPI reference ${utr} submitted. Awaiting confirmation` });
  await o.save();
  notify(o.user, 'Payment under review', `We received your UPI reference for order ${o.number}. We will confirm shortly.`, '/account?tab=orders');
  return ok({ ok: true });
}, { limit: [10, 60_000] });
