import mongoose from 'mongoose';
import { route, ok, ApiError } from '@/lib/api';
import Newsletter from '@/models/Newsletter';

export const DELETE = route(async ({ params }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Not found', 404);
  await Newsletter.findByIdAndDelete(params.id);
  return ok({ ok: true });
}, { perm: 'newsletter' });
