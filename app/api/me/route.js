import { route, ok, clean, ApiError } from '@/lib/api';
import { profileSchema } from '@/lib/validations';
import User from '@/models/User';

const pick = (u) => ({ id: String(u._id), name: u.name, email: u.email, phone: u.phone || '', role: u.role, points: u.points, referralCode: u.referralCode, emailVerified: u.emailVerified });

export const GET = route(async ({ session }) => {
  const u = await User.findById(session.user.id);
  if (!u) throw new ApiError('Account not found', 404);
  return ok(pick(u));
}, { auth: true });

export const PATCH = route(async ({ req, session }) => {
  const data = profileSchema.parse(await req.json());
  const u = await User.findByIdAndUpdate(session.user.id, { ...(data.name && { name: clean(data.name) }), ...(data.phone !== undefined && { phone: data.phone }) }, { new: true });
  return ok(pick(u));
}, { auth: true });
