export const dynamic = 'force-dynamic';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { route, ok, ApiError, clean } from '@/lib/api';
import { registerSchema } from '@/lib/validations';
import { sendMail, siteUrl } from '@/lib/mailer';
import User from '@/models/User';

export const POST = route(async ({ req }) => {
  const data = registerSchema.parse(await req.json());
  if (await User.exists({ email: data.email })) throw new ApiError('An account with this email already exists', 409);
  const verifyToken = crypto.randomBytes(24).toString('hex');
  const user = await User.create({
    name: clean(data.name), email: data.email, phone: data.phone || undefined,
    passwordHash: await bcrypt.hash(data.password, 12), verifyToken,
    referralCode: `LUM${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
  });
  const link = `${siteUrl()}/api/auth/verify?token=${verifyToken}`;
  sendMail({ to: user.email, subject: 'Verify your Lumière email', html: `<p>Hi ${user.name},</p><p>Confirm your email: <a href="${link}">${link}</a></p>`, text: `Confirm your email: ${link}` }).catch(console.error);
  return ok({ ok: true, message: 'Account created. You can log in now.' }, 201);
}, { limit: [10, 60_000] });
