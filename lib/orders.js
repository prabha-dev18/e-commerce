import crypto from 'crypto';
import Product from '@/models/Product';
import Notification from '@/models/Notification';
import Order from '@/models/Order';
import Settings from '@/models/Settings';
import { sendMail, siteUrl } from './mailer';
import { invoiceLink } from './invoiceToken';

export const genNumber = () => `LUM-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
export const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export async function reserveStock(lines) {
  const done = [];
  for (const l of lines) {
    const r = await Product.updateOne({ id: l.productId, stock: { $gte: l.qty } }, { $inc: { stock: -l.qty } });
    if (!r.modifiedCount) { await restoreStock(done); return l; }
    done.push(l);
  }
  return null;
}
export const restoreStock = (lines) => Promise.all(lines.map((l) => Product.updateOne({ id: l.productId }, { $inc: { stock: l.qty } })));
export const notify = (user, title, body, href) => user ? Notification.create({ user, title, body, href }).catch(() => {}) : null;

export function orderEmail(o, heading = 'Thank you for your order', tpl = {}) {
  const rows = o.items.map((i) => `<tr><td>${i.name}${i.variant ? ` (${i.variant})` : ''} x ${i.qty}</td><td align="right">${rupees(i.price * i.qty)}</td></tr>`).join('');
  const email = o.guestEmail || o.email;
  const subject = tpl.orderSubject ? tpl.orderSubject.replace(/\{number\}/g, o.number) : `${heading}: ${o.number}`;
  const intro = tpl.orderIntro ? `<p>${tpl.orderIntro}</p>` : '';
  const sign = tpl.signature ? `<p>${tpl.signature}</p>` : '';
  return { to: email, subject, text: `${heading}. Order ${o.number}, total ${rupees(o.total)}. Track: ${siteUrl()}/track-order`, html: `<div style="font-family:Arial,sans-serif;max-width:560px"><h2>${heading}</h2>${intro}<p>Order <b>${o.number}</b></p><table width="100%" cellpadding="6">${rows}<tr><td><b>Total</b></td><td align="right"><b>${rupees(o.total)}</b></td></tr></table><p>Payment: ${o.payment.method === 'cod' ? 'Cash on delivery' : o.payment.status === 'paid' ? 'Paid' : o.payment.status}</p>${o._id ? `<p><a href="${invoiceLink(siteUrl(), o._id)}">Download your invoice</a></p>` : ''}<p>Delivering to ${o.address.name}, ${o.address.line1}, ${o.address.city} ${o.address.pincode}.</p><p><a href="${siteUrl()}/track-order">Track your order</a></p>${sign}</div>` };
}

/** Idempotent: safe to call from both the browser verify step and the webhook. */
export async function markPaid(order, paymentId) {
  if (order.payment.status === 'paid') return order;
  order.payment.status = 'paid'; order.payment.paidAt = new Date();
  if (paymentId) order.payment.razorpayPaymentId = paymentId;
  if (order.status === 'placed') order.status = 'confirmed';
  order.tracking.push({ status: 'confirmed', note: 'Payment received' });
  await order.save();
  const full = await Order.findById(order._id).populate('user', 'email');
  sendOrderMail({ ...full.toObject(), email: full.user?.email }, 'Payment received').catch(console.error);
  notify(order.user, 'Payment received', `Order ${order.number} is confirmed.`, '/account?tab=orders');
  return order;
}

/** Loads the admin-edited email wording and sends an order email. */
export async function sendOrderMail(order, heading) {
  const s = await Settings.findOne({ key: 'store' }).select('emailTemplates').lean().catch(() => null);
  return sendMail(orderEmail(order, heading, s?.emailTemplates || {}));
}
