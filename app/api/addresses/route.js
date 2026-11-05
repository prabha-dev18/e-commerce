import { route, ok, ApiError, clean } from '@/lib/api';
import { addressSchema } from '@/lib/validations';
import Address from '@/models/Address';

const tidy = (d) => ({ label: clean(d.label || 'Home'), name: clean(d.name), phone: d.phone, line1: clean(d.line1), line2: clean(d.line2 || ''), city: clean(d.city), state: clean(d.state), pincode: d.pincode, isDefault: !!d.isDefault });

export const GET = route(async ({ session }) => {
  const items = await Address.find({ user: session.user.id }).sort({ isDefault: -1, createdAt: -1 }).lean();
  return ok({ items: items.map(({ __v, ...a }) => ({ ...a, id: String(a._id) })) });
}, { auth: true });

export const POST = route(async ({ req, session }) => {
  const d = addressSchema.parse(await req.json());
  if ((await Address.countDocuments({ user: session.user.id })) >= 10) throw new ApiError('You can save up to 10 addresses');
  const first = !(await Address.exists({ user: session.user.id }));
  if (d.isDefault) await Address.updateMany({ user: session.user.id }, { isDefault: false });
  const a = await Address.create({ user: session.user.id, ...tidy(d), isDefault: d.isDefault || first });
  return ok({ id: String(a._id) }, 201);
}, { auth: true, limit: [30, 60_000] });
