export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';
import { cartSchema } from '@/lib/validations';
import Cart from '@/models/Cart';

export const GET = route(async ({ session }) => {
  const c = await Cart.findOne({ user: session.user.id }).lean();
  return ok({ items: (c?.items || []).map(({ _id, ...i }) => i) });
}, { auth: true });

export const PUT = route(async ({ req, session }) => {
  const { items } = cartSchema.parse(await req.json());
  await Cart.findOneAndUpdate({ user: session.user.id }, { items }, { upsert: true });
  return ok({ ok: true });
}, { auth: true, limit: [120, 60_000] });
