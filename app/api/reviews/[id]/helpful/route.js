export const dynamic = 'force-dynamic';
import mongoose from 'mongoose';
import { route, ok, ApiError } from '@/lib/api';
import Review from '@/models/Review';

export const POST = route(async ({ params, session }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Review not found', 404);
  const uid = new mongoose.Types.ObjectId(session.user.id);
  const r = await Review.findOneAndUpdate({ _id: params.id, status: 'approved', helpfulBy: { $ne: uid } }, { $addToSet: { helpfulBy: uid }, $inc: { helpful: 1 } }, { new: true });
  if (!r) throw new ApiError('Already voted or review not found', 409);
  return ok({ helpful: r.helpful });
}, { auth: true, limit: [30, 60_000] });
