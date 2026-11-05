import { route, ok, escapeRegex } from '@/lib/api';
import User from '@/models/User';
import Order from '@/models/Order';

export const GET = route(async ({ req }) => {
  const sp = req.nextUrl.searchParams;
  const q = (sp.get('q') || '').trim().slice(0, 60);
  const f = sp.get('staff') === '1' ? { role: { $ne: 'user' } } : {};
  if (q) { const r = new RegExp(escapeRegex(q), 'i'); f.$or = [{ name: r }, { email: r }, { phone: r }]; }
  const limit = 20, page = Math.max(Number(sp.get('page')) || 1, 1);
  const [users, total] = await Promise.all([User.find(f).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select('name email phone role blocked points emailVerified provider createdAt').lean(), User.countDocuments(f)]);
  const stats = await Order.aggregate([{ $match: { user: { $in: users.map((u) => u._id) }, status: { $nin: ['cancelled', 'returned'] } } }, { $group: { _id: '$user', orders: { $sum: 1 }, spent: { $sum: '$total' } } }]);
  const by = Object.fromEntries(stats.map((s) => [String(s._id), s]));
  return ok({ items: users.map((u) => ({ ...u, id: String(u._id), orders: by[String(u._id)]?.orders || 0, spent: by[String(u._id)]?.spent || 0 })), total, pages: Math.max(Math.ceil(total / limit), 1) });
}, { perm: 'customers' });
