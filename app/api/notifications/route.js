export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';
import Notification from '@/models/Notification';

export const GET = route(async ({ session }) => {
  const items = await Notification.find({ user: session.user.id }).sort({ createdAt: -1 }).limit(30).lean();
  return ok({ items: items.map((n) => ({ id: String(n._id), title: n.title, body: n.body, href: n.href, read: n.read, at: n.createdAt })), unread: items.filter((n) => !n.read).length });
}, { auth: true });

export const PATCH = route(async ({ session }) => {
  await Notification.updateMany({ user: session.user.id, read: false }, { read: true });
  return ok({ ok: true });
}, { auth: true });
