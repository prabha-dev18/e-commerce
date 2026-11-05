import { route, ok } from '@/lib/api';
import ReturnRequest from '@/models/ReturnRequest';

export const GET = route(async ({ req }) => {
  const sp = req.nextUrl.searchParams;
  const f = sp.get('status') ? { status: sp.get('status') } : {};
  const limit = 20, page = Math.max(Number(sp.get('page')) || 1, 1);
  const [items, total] = await Promise.all([ReturnRequest.find(f).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('order', 'number total payment items').populate('user', 'name email').lean(), ReturnRequest.countDocuments(f)]);
  return ok({ items: items.map((r) => ({ id: String(r._id), type: r.type, status: r.status, reason: r.reason, items: r.items, createdAt: r.createdAt, orderId: r.order && String(r.order._id), orderNumber: r.order?.number, paid: r.order?.payment?.status === 'paid', customer: r.user?.name, email: r.user?.email })), total, pages: Math.max(Math.ceil(total / limit), 1) });
}, { perm: 'returns' });
