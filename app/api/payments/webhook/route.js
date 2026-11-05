import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { markPaid, restoreStock } from '@/lib/orders';
import Order from '@/models/Order';

// Razorpay dashboard > Webhooks: URL https://YOUR-DOMAIN/api/payments/webhook, events payment.captured, payment.failed, refund.processed
export async function POST(req) {
  const raw = await req.text();
  if (!verifyWebhookSignature(raw, req.headers.get('x-razorpay-signature'))) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  await connectDB();
  const evt = JSON.parse(raw);
  const pay = evt.payload?.payment?.entity;
  if (pay?.order_id) {
    const o = await Order.findOne({ 'payment.razorpayOrderId': pay.order_id });
    if (o && evt.event === 'payment.captured') await markPaid(o, pay.id);
    if (o && evt.event === 'payment.failed' && o.payment.status === 'pending') { o.payment.status = 'failed'; o.tracking.push({ status: 'placed', note: 'Payment failed' }); await o.save(); }
  }
  const qr = evt.payload?.qr_code?.entity;
  if (qr?.id && evt.event === 'qr_code.credited') {
    const o = await Order.findOne({ 'payment.qrId': qr.id });
    if (o && pay?.status !== 'failed' && (!pay?.amount || pay.amount === Math.round(o.total * 100))) await markPaid(o, pay?.id || null);
  }
  if (evt.event === 'refund.processed') {
    const o = await Order.findOne({ 'payment.razorpayPaymentId': evt.payload?.refund?.entity?.payment_id });
    if (o) { o.payment.status = 'refunded'; await o.save(); }
  }
  return NextResponse.json({ ok: true });
}
