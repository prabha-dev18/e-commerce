export const dynamic = 'force-dynamic';
import { route, ok, escapeRegex } from '@/lib/api';
import Order from '@/models/Order';

export const GET = route(async ({ req }) => {
  const sp = req.nextUrl.searchParams;
  const f = {};
  if (sp.get('status')) f.status = sp.get('status');
  if (sp.get('payment')) f['payment.status'] = sp.get('payment');
  const q = (sp.get('q') || '').trim().slice(0, 60);
  if (q) { const r = new RegExp(escapeRegex(q), 'i'); f.$or = [{ number: r }, { guestEmail: r }, { 'address.name': r }, { 'address.phone': r }]; }
  const limit = 20, page = Math.max(Number(sp.get('page')) || 1, 1);
  const [items, total] = await Promise.all([Order.find(f).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('user', 'name email').lean(), Order.countDocuments(f)]);
  return ok({ items, total, pages: Math.max(Math.ceil(total / limit), 1) });
}, { perm: 'orders' });
