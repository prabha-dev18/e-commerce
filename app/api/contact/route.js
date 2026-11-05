export const dynamic = 'force-dynamic';
import { route, ok, clean } from '@/lib/api';
import { contactSchema } from '@/lib/validations';
import ContactMessage from '@/models/ContactMessage';
import { sendMail } from '@/lib/mailer';

export const POST = route(async ({ req }) => {
  const d = contactSchema.parse(await req.json());
  await ContactMessage.create({ name: clean(d.name), email: d.email, subject: clean(d.subject || ''), message: clean(d.message) });
  sendMail({ to: process.env.MAIL_FROM || 'care@lumiere.in', subject: `Contact: ${clean(d.subject || 'New message')}`, html: `<p>${clean(d.name)} (${d.email})</p><p>${clean(d.message)}</p>`, text: `${d.name} (${d.email})\n${d.message}` }).catch(console.error);
  return ok({ ok: true, message: 'Thanks. We will reply within one working day.' }, 201);
}, { limit: [5, 60_000] });
