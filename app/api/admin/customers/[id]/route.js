import mongoose from 'mongoose';
import { z } from 'zod';
import { route, ok, ApiError } from '@/lib/api';
import User from '@/models/User';
import Order from '@/models/Order';
import Address from '@/models/Address';

export const GET = route(async ({ params }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Customer not found', 404);
  const u = await User.findById(params.id).select('-passwordHash -resetTokenHash -verifyToken -__v').lean();
  if (!u) throw new ApiError('Customer not found', 404);
  const [orders, addresses] = await Promise.all([Order.find({ user: u._id }).sort({ createdAt: -1 }).limit(20).select('number total status createdAt').lean(), Address.find({ user: u._id }).lean()]);
  return ok({ user: u, orders, addresses });
}, { perm: 'customers' });

// Changing a role or blocking an account is admin-only ('users' permission).
export const PATCH = route(async ({ req, params, session }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Customer not found', 404);
  const d = z.object({ role: z.enum(['user', 'manager', 'support', 'admin']).optional(), blocked: z.boolean().optional() }).parse(await req.json());
  if (params.id === session.user.id) throw new ApiError('You cannot change your own role or block yourself');
  const u = await User.findByIdAndUpdate(params.id, d, { new: true }).select('role blocked');
  if (!u) throw new ApiError('Customer not found', 404);
  return ok({ role: u.role, blocked: u.blocked, note: 'Role changes apply the next time that person logs in.' });
}, { perm: 'users' });
