import mongoose from 'mongoose';
import { route, ok, ApiError } from '@/lib/api';
import Order from '@/models/Order';

export const GET = route(async ({ params, session }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Order not found', 404);
  const o = await Order.findById(params.id).lean();
  const staff = ['admin', 'manager', 'support'].includes(session.user.role);
  if (!o || (String(o.user) !== session.user.id && !staff)) throw new ApiError('Order not found', 404);
  return ok({ order: o });
}, { auth: true });
