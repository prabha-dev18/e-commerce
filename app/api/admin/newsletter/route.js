export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';
import { toCsv } from '@/lib/csv';
import Newsletter from '@/models/Newsletter';

export const GET = route(async ({ req }) => {
  const sp = req.nextUrl.searchParams;
  if (sp.get('format') === 'csv') {
    const all = await Newsletter.find({ active: true }).sort({ createdAt: -1 }).limit(50000).lean();
    return new Response(toCsv(all.map((s) => ({ email: s.email, joined: new Date(s.createdAt).toISOString().slice(0, 10) })), ['email', 'joined']), { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="subscribers.csv"' } });
  }
  const limit = 30, page = Math.max(Number(sp.get('page')) || 1, 1);
  const [items, total] = await Promise.all([Newsletter.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Newsletter.countDocuments()]);
  return ok({ items: items.map((s) => ({ id: String(s._id), email: s.email, active: s.active, createdAt: s.createdAt })), total, pages: Math.max(Math.ceil(total / limit), 1) });
}, { perm: 'newsletter' });
