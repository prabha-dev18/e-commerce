export const dynamic = 'force-dynamic';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { route, ok, ApiError } from '@/lib/api';
import { resetSchema } from '@/lib/validations';
import User from '@/models/User';

export const POST = route(async ({ req }) => {
  const { token, password } = resetSchema.parse(await req.json());
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetTokenHash: hash, resetExpires: { $gt: new Date() } });
  if (!user) throw new ApiError('This reset link is invalid or has expired', 400);
  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetTokenHash = undefined; user.resetExpires = undefined;
  await user.save();
  return ok({ ok: true, message: 'Password updated. You can log in now.' });
}, { limit: [10, 10 * 60_000] });
