import bcrypt from 'bcryptjs';
import { route, ok, ApiError } from '@/lib/api';
import { passwordChangeSchema } from '@/lib/validations';
import User from '@/models/User';

export const POST = route(async ({ req, session }) => {
  const { current, password } = passwordChangeSchema.parse(await req.json());
  const u = await User.findById(session.user.id);
  if (!u?.passwordHash) throw new ApiError('This account signs in with Google, so there is no password to change', 400);
  if (!(await bcrypt.compare(current, u.passwordHash))) throw new ApiError('Your current password is not correct', 400);
  u.passwordHash = await bcrypt.hash(password, 12);
  await u.save();
  return ok({ ok: true, message: 'Password changed' });
}, { auth: true, limit: [5, 10 * 60_000] });
