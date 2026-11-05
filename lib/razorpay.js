import crypto from 'crypto';
import { ApiError } from './errors';

// Talks to the Razorpay REST API directly (no SDK needed). Amounts are in rupees here and converted to paise.
function creds() {
  const id = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw new ApiError('Online payments are not set up yet. Please choose Cash on delivery.', 503);
  return { id, secret, header: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}` };
}
const safeEqual = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b || '')); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const hmac = (secret, data) => crypto.createHmac('sha256', secret).update(data).digest('hex');

export async function createRazorpayOrder({ amount, receipt }) {
  const c = creds();
  const r = await fetch('https://api.razorpay.com/v1/orders', { method: 'POST', headers: { Authorization: c.header, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: Math.round(amount * 100), currency: 'INR', receipt, payment_capture: 1 }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(j.error?.description || 'Payment service is unavailable. Try again or choose Cash on delivery.', 502);
  return { razorpayOrderId: j.id, keyId: c.id, amount: j.amount };
}
export const verifyPaymentSignature = ({ orderId, paymentId, signature }) => safeEqual(hmac(creds().secret, `${orderId}|${paymentId}`), signature);
export const verifyWebhookSignature = (rawBody, signature) => !!process.env.RAZORPAY_WEBHOOK_SECRET && safeEqual(hmac(process.env.RAZORPAY_WEBHOOK_SECRET, rawBody), signature);
export async function refundPayment(paymentId, amount) {
  const c = creds();
  const r = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, { method: 'POST', headers: { Authorization: c.header, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: Math.round(amount * 100), speed: 'normal' }) });
  return r.ok;
}

export const razorpayReady = () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
export const directUpiReady = () => !!process.env.UPI_VPA;
export const upiReady = () => razorpayReady() || directUpiReady();

/** One-time UPI QR for a fixed amount. Any UPI app can scan it. Valid for 15 minutes. */
export async function createUpiQr({ amount, receipt }) {
  const c = creds();
  const closeBy = Math.floor(Date.now() / 1000) + 15 * 60;
  const r = await fetch('https://api.razorpay.com/v1/payments/qr_codes', { method: 'POST', headers: { Authorization: c.header, 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'upi_qr', name: 'Lumière', usage: 'single_use', fixed_amount: true, payment_amount: Math.round(amount * 100), description: `Order ${receipt}`, close_by: closeBy, notes: { order: receipt } }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.image_url) throw new ApiError(j.error?.description || 'Could not create the QR code right now. Please try again.', 502);
  return { qrId: j.id, imageUrl: j.image_url, expiresAt: new Date(closeBy * 1000) };
}
/** Returns the captured payment (if any) made against a QR code. */
export async function findQrPayment(qrId, amount) {
  const c = creds();
  const r = await fetch(`https://api.razorpay.com/v1/payments/qr_codes/${encodeURIComponent(qrId)}/payments`, { headers: { Authorization: c.header }, cache: 'no-store' });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return null;
  return (j.items || []).find((p) => p.status === 'captured' && p.amount === Math.round(amount * 100)) || null;
}
export async function closeUpiQr(qrId) {
  try { const c = creds(); await fetch(`https://api.razorpay.com/v1/payments/qr_codes/${encodeURIComponent(qrId)}/close`, { method: 'POST', headers: { Authorization: c.header } }); } catch { /* QR simply expires on its own */ }
}
