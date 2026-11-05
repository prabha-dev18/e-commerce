export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';
import { newsletterSchema } from '@/lib/validations';
import Newsletter from '@/models/Newsletter';
import { sendMail } from '@/lib/mailer';

export const POST = route(async ({ req }) => {
  const { email } = newsletterSchema.parse(await req.json());
  const res = await Newsletter.updateOne({ email }, { $setOnInsert: { email, source: 'website' }, $set: { active: true } }, { upsert: true });
  if (res.upsertedCount) sendMail({ to: email, subject: 'Welcome to Lumière: here is your 10% off', html: '<p>Use code <b>WELCOME10</b> on your first order.</p>', text: 'Use code WELCOME10 on your first order.' }).catch(console.error);
  return ok({ ok: true, message: 'You are in. Your 10% code: WELCOME10' });
}, { limit: [5, 60_000] });
