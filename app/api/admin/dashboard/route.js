import { route, ok } from '@/lib/api';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Review from '@/models/Review';
import ReturnRequest from '@/models/ReturnRequest';
import ContactMessage from '@/models/ContactMessage';

export const GET = route(async () => {
  const since = new Date(Date.now() - 29 * 864e5); since.setHours(0, 0, 0, 0);
  const live = { status: { $nin: ['cancelled', 'returned'] } };
  const [byDay, byStatus, top, low, recent, totals, customers, returns, reviews, messages] = await Promise.all([
    Order.aggregate([{ $match: { createdAt: { $gte: since }, ...live } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } }]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([{ $match: live }, { $unwind: '$items' }, { $group: { _id: '$items.productId', name: { $first: '$items.name' }, qty: { $sum: '$items.qty' }, revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } } } }, { $sort: { qty: -1 } }, { $limit: 5 }]),
    Product.find({ active: true, stock: { $lte: 10 } }).sort({ stock: 1 }).limit(8).select('id name stock').lean(),
    Order.find().sort({ createdAt: -1 }).limit(6).select('number total status createdAt address.name').lean(),
    Order.aggregate([{ $match: live }, { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } }]),
    User.countDocuments({ role: 'user' }),
    ReturnRequest.countDocuments({ status: 'requested' }),
    Review.countDocuments({ status: 'pending' }),
    ContactMessage.countDocuments({ handled: false }),
  ]);
  const map = Object.fromEntries(byDay.map((d) => [d._id, d]));
  const days = Array.from({ length: 30 }, (_, i) => {
    const key = new Date(since.getTime() + i * 864e5 + 5.5 * 36e5).toISOString().slice(0, 10);
    return { date: key.slice(5), revenue: map[key]?.revenue || 0, orders: map[key]?.orders || 0 };
  });
  const t = totals[0] || { revenue: 0, orders: 0 };
  const last30 = days.reduce((n, d) => n + d.revenue, 0);
  return ok({ totals: { revenue: t.revenue, orders: t.orders, aov: t.orders ? Math.round(t.revenue / t.orders) : 0, customers, last30 }, days, byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })), top, low, recent, pending: { returns, reviews, messages } });
}, { perm: 'dashboard' });
