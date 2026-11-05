export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';
import { wishlistSchema } from '@/lib/validations';
import Wishlist from '@/models/Wishlist';

export const GET = route(async ({ session }) => {
  const w = await Wishlist.findOne({ user: session.user.id }).lean();
  return ok({ ids: w?.ids || [] });
}, { auth: true });

export const PUT = route(async ({ req, session }) => {
  const { ids } = wishlistSchema.parse(await req.json());
  await Wishlist.findOneAndUpdate({ user: session.user.id }, { ids: [...new Set(ids)] }, { upsert: true });
  return ok({ ok: true });
}, { auth: true, limit: [120, 60_000] });
