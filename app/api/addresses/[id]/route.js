import mongoose from 'mongoose';
import { route, ok, ApiError, clean } from '@/lib/api';
import { addressSchema } from '@/lib/validations';
import Address from '@/models/Address';

const check = (id) => { if (!mongoose.isValidObjectId(id)) throw new ApiError('Address not found', 404); };

export const PUT = route(async ({ req, params, session }) => {
  check(params.id);
  const d = addressSchema.parse(await req.json());
  if (d.isDefault) await Address.updateMany({ user: session.user.id }, { isDefault: false });
  const a = await Address.findOneAndUpdate({ _id: params.id, user: session.user.id }, { label: clean(d.label || 'Home'), name: clean(d.name), phone: d.phone, line1: clean(d.line1), line2: clean(d.line2 || ''), city: clean(d.city), state: clean(d.state), pincode: d.pincode, isDefault: !!d.isDefault }, { new: true });
  if (!a) throw new ApiError('Address not found', 404);
  return ok({ ok: true });
}, { auth: true });

export const DELETE = route(async ({ params, session }) => {
  check(params.id);
  const a = await Address.findOneAndDelete({ _id: params.id, user: session.user.id });
  if (!a) throw new ApiError('Address not found', 404);
  if (a.isDefault) { const next = await Address.findOne({ user: session.user.id }); if (next) { next.isDefault = true; await next.save(); } }
  return ok({ ok: true });
}, { auth: true });
