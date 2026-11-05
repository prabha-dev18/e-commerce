import { route, ok } from '@/lib/api';
import { settingsSchema } from '@/lib/adminSchemas';
import Settings from '@/models/Settings';

const status = () => ({ razorpay: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET), upi: !!(process.env.UPI_VPA || (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)), webhook: !!process.env.RAZORPAY_WEBHOOK_SECRET, cloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_SECRET), smtp: !!process.env.SMTP_HOST, google: !!process.env.GOOGLE_CLIENT_ID });

export const GET = route(async () => {
  const s = await Settings.findOne({ key: 'store' }).lean();
  return ok({ settings: s || { storeName: 'Lumière', email: '', phone: '', gstPercent: 18, codEnabled: true, emailTemplates: {}, homeSections: {} }, integrations: status() });
}, { perm: 'settings' });

export const PUT = route(async ({ req }) => {
  const d = settingsSchema.parse(await req.json());
  await Settings.updateOne({ key: 'store' }, { $set: d, $setOnInsert: { key: 'store' } }, { upsert: true });
  return ok({ ok: true });
}, { perm: 'settings' });
