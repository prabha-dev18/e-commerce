export const dynamic = 'force-dynamic';
import crypto from 'crypto';
import { route, ok } from '@/lib/api';
import { forgotSchema } from '@/lib/validations';
import { sendMail, siteUrl } from '@/lib/mailer';
import User from '@/models/User';

// Always answers the same way so the endpoint cannot be used to discover which emails have accounts.
export const POST = route(async ({ req }) => {
  const { email } = forgotSchema.parse(await req.json());
  const user = await User.findOne({ email, provider: 'credentials' });
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    user.resetExpires = new Date(Date.now() + 30 * 60_000);
    await user.save();
    const link = `${siteUrl()}/reset-password/${token}`;
    await sendMail({ to: email, subject: 'Reset your Lumière password', html: `<p>Reset your password (valid for 30 minutes): <a href="${link}">${link}</a></p>`, text: `Reset your password (valid for 30 minutes): ${link}` });
  }
  return ok({ ok: true, message: 'If that email has an account, a reset link is on its way.' });
}, { limit: [5, 10 * 60_000] });
