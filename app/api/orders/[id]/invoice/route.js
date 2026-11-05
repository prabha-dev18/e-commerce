export const dynamic = 'force-dynamic';
import mongoose from 'mongoose';
import { route, ApiError } from '@/lib/api';
import { validInvoiceToken } from '@/lib/invoiceToken';
import Order from '@/models/Order';
import Settings from '@/models/Settings';

const esc = (s = '') => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const below100 = (n) => (n < 20 ? ones[n] : `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ''}`);
const below1000 = (n) => (n >= 100 ? `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${below100(n % 100)}` : ''}` : below100(n));
function words(amount) {
  let r = Math.floor(amount);
  const paise = Math.round((amount - r) * 100);
  if (r === 0 && paise === 0) return 'Zero Rupees Only';
  const parts = [];
  const crore = Math.floor(r / 1e7); r %= 1e7;
  const lakh = Math.floor(r / 1e5); r %= 1e5;
  const thousand = Math.floor(r / 1e3); r %= 1e3;
  if (crore) parts.push(`${below1000(crore)} Crore`);
  if (lakh) parts.push(`${below100(lakh)} Lakh`);
  if (thousand) parts.push(`${below100(thousand)} Thousand`);
  if (r) parts.push(below1000(r));
  const rs = parts.length ? `${parts.join(' ')} ${Math.floor(amount) === 1 ? 'Rupee' : 'Rupees'}` : '';
  const ps = paise ? `${rs ? ' and ' : ''}${below100(paise)} Paise` : '';
  return `${rs}${ps} Only`;
}

const payLabel = (p) => (p.method === 'cod' ? 'Cash on delivery' : p.method === 'upi' ? 'UPI (QR code)' : 'Online (Razorpay)');

// Tax invoice. Owners and staff can open it while logged in; guests use the signed link from their order email or success page.
export const GET = route(async ({ req, params, session }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Order not found', 404);
  const [o, s] = await Promise.all([Order.findById(params.id).lean(), Settings.findOne({ key: 'store' }).lean()]);
  if (!o) throw new ApiError('Order not found', 404);
  const staff = ['admin', 'manager', 'support'].includes(session?.user?.role);
  const owner = session?.user?.id && o.user && String(o.user) === session.user.id;
  if (!staff && !owner && !validInvoiceToken(o._id, req.nextUrl.searchParams.get('t'))) throw new ApiError('Order not found', 404);

  const autoPrint = req.nextUrl.searchParams.get('download') === '1';
  const store = {
    name: s?.storeName || process.env.NEXT_PUBLIC_SITE_NAME || 'Lumière',
    email: s?.email || '', phone: s?.phone || '',
    address: process.env.STORE_ADDRESS || '', gstin: process.env.STORE_GSTIN || '', state: process.env.STORE_STATE || '',
  };
  const gstPct = s?.gstPercent ?? 18;
  const base = Math.max(0, (o.subtotal || 0) - (o.coupon?.discount || 0));
  const tax = o.tax || 0;
  const taxable = Math.max(0, base - tax);
  const sameState = store.state && o.address.state && store.state.trim().toLowerCase() === String(o.address.state).trim().toLowerCase();
  const half = Math.round((tax / 2) * 100) / 100;
  const taxRows = sameState || !store.state
    ? `<tr><td></td><td class="r">CGST (${gstPct / 2}%)</td><td class="r">${money(half)}</td></tr><tr><td></td><td class="r">SGST (${gstPct / 2}%)</td><td class="r">${money(tax - half)}</td></tr>`
    : `<tr><td></td><td class="r">IGST (${gstPct}%)</td><td class="r">${money(tax)}</td></tr>`;

  const paid = o.payment.status === 'paid';
  const refunded = o.payment.status === 'refunded';
  const stamp = refunded ? ['REFUNDED', '#B98282'] : paid ? ['PAID', '#2A211D'] : o.payment.method === 'cod' ? ['PAY ON DELIVERY', '#B99A6B'] : ['PAYMENT PENDING', '#B98282'];
  const ref = o.payment.razorpayPaymentId || o.payment.utr || '';
  const rows = o.items.map((i, n) => `<tr><td>${n + 1}</td><td>${esc(i.name)}${i.variant ? `<br><small>${esc(i.variant)}</small>` : ''}</td><td class="r">${i.qty}</td><td class="r">${money(i.price)}</td><td class="r">${money(i.price * i.qty)}</td></tr>`).join('');

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Invoice ${esc(o.number)}</title><style>
*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#2A211D;background:#F8F5F0;margin:0;padding:24px 12px}
.sheet{max-width:800px;margin:0 auto;background:#fff;padding:36px;border-radius:16px;box-shadow:0 8px 30px rgba(42,33,29,.08);position:relative}
h1{font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:30px;margin:0;letter-spacing:.5px}
.top{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;border-bottom:2px solid #B99A6B;padding-bottom:18px}
.muted{color:#756A61;font-size:13px;line-height:1.6}.label{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#B99A6B;font-weight:700}
.cols{display:flex;gap:30px;flex-wrap:wrap;margin-top:22px}.cols>div{flex:1;min-width:220px;font-size:14px;line-height:1.6}
table{width:100%;border-collapse:collapse;margin-top:22px}th{background:#EDE3D8;font-size:12px;text-transform:uppercase;letter-spacing:.06em}
th,td{padding:9px 8px;border-bottom:1px solid #EDE3D8;text-align:left;font-size:14px}.r{text-align:right}
.tot{margin-top:6px;width:100%}.tot td{border:0;padding:5px 8px}.tot .grand td{border-top:2px solid #2A211D;font-size:17px;font-weight:700;padding-top:10px}
.words{margin-top:14px;font-size:13px;color:#756A61}.stamp{position:absolute;right:36px;top:196px;border:3px solid ${stamp[1]};color:${stamp[1]};padding:4px 14px;font-weight:700;letter-spacing:.14em;border-radius:8px;transform:rotate(-8deg);opacity:.85;font-size:15px}
.foot{margin-top:28px;border-top:1px solid #EDE3D8;padding-top:14px;font-size:12px;color:#756A61;text-align:center}
.bar{max-width:800px;margin:16px auto 0;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.btn{padding:12px 24px;background:#2A211D;color:#fff;border:0;border-radius:99px;cursor:pointer;font-size:14px;font-weight:600}.btn.alt{background:#fff;color:#2A211D;border:1px solid #2A211D}
@page{size:A4;margin:12mm}@media print{body{background:#fff;padding:0}.sheet{box-shadow:none;border-radius:0;padding:0}.bar{display:none}}
@media(max-width:560px){.sheet{padding:20px}.stamp{position:static;display:inline-block;margin:10px 0;transform:none}}
</style></head><body>
<div class="sheet">
<div class="top"><div><h1>${esc(store.name)}</h1><div class="muted">${esc(store.address)}${store.address ? '<br>' : ''}${esc(store.email)}${store.email && store.phone ? ' · ' : ''}${esc(store.phone)}${store.gstin ? `<br>GSTIN: ${esc(store.gstin)}` : ''}</div></div>
<div class="muted" style="text-align:right"><div class="label">Tax invoice</div><b style="font-size:16px;color:#2A211D">INV-${esc(o.number)}</b><br>Order: ${esc(o.number)}<br>Date: ${new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div></div>
<div class="stamp">${stamp[0]}</div>
<div class="cols"><div><div class="label">Billed and shipped to</div><b>${esc(o.address.name)}</b><br>${esc(o.address.line1)}${o.address.line2 ? `, ${esc(o.address.line2)}` : ''}<br>${esc(o.address.city)}, ${esc(o.address.state)} ${esc(o.address.pincode)}<br>Phone: ${esc(o.address.phone)}${o.guestEmail ? `<br>${esc(o.guestEmail)}` : ''}${o.gstin ? `<br>Customer GSTIN: ${esc(o.gstin)}` : ''}</div>
<div><div class="label">Payment</div>${esc(payLabel(o.payment))}<br>Status: <b>${esc(o.payment.status)}</b>${ref ? `<br>Reference: ${esc(ref)}` : ''}${o.payment.paidAt ? `<br>Paid on: ${new Date(o.payment.paidAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : ''}<br>Shipping: ${esc(o.shippingMethod)}</div></div>
<table><tr><th>#</th><th>Item</th><th class="r">Qty</th><th class="r">Rate (incl. GST)</th><th class="r">Amount</th></tr>${rows}</table>
<table class="tot"><tr><td style="width:45%"></td><td class="r">Subtotal</td><td class="r">${money(o.subtotal)}</td></tr>${o.coupon?.discount ? `<tr><td></td><td class="r">Discount (${esc(o.coupon.code)})</td><td class="r">-${money(o.coupon.discount)}</td></tr>` : ''}<tr><td></td><td class="r">Taxable value</td><td class="r">${money(taxable)}</td></tr>${taxRows}<tr><td></td><td class="r">Shipping</td><td class="r">${o.shipping ? money(o.shipping) : 'Free'}</td></tr><tr class="grand"><td></td><td class="r">Total</td><td class="r">${money(o.total)}</td></tr></table>
<p class="words"><b>Amount in words:</b> ${esc(words(o.total))}</p>
<div class="foot">Thank you for shopping with ${esc(store.name)}. This is a computer-generated invoice and does not need a signature.<br>Questions? ${esc(store.email || 'Write to our support team')}</div>
</div>
<div class="bar"><button class="btn" onclick="window.print()">Download PDF</button><button class="btn alt" onclick="window.print()">Print</button></div>
<script>${autoPrint ? "window.addEventListener('load',function(){setTimeout(function(){window.print()},400)});" : ''}</script>
</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store' } });
}, { optionalAuth: true });
