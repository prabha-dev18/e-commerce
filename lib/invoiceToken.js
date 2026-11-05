import crypto from 'crypto';

// A signed token lets guests (no account) open their own invoice link. It cannot be guessed without the server secret.
const secret = () => process.env.NEXTAUTH_SECRET || 'dev-only-invoice-secret';
export const invoiceToken = (id) => crypto.createHmac('sha256', secret()).update(`invoice:${String(id)}`).digest('hex').slice(0, 32);
export function validInvoiceToken(id, t) {
  const a = Buffer.from(invoiceToken(id)), b = Buffer.from(String(t || ''));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
export const invoiceLink = (base, id) => `${base}/api/orders/${id}/invoice?t=${invoiceToken(id)}`;
