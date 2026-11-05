import mongoose from 'mongoose';
import { z } from 'zod';
import { route, ok, ApiError } from '@/lib/api';
import Review from '@/models/Review';
import Product from '@/models/Product';

export const PATCH = route(async ({ req, params }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Review not found', 404);
  const { status } = z.object({ status: z.enum(['approved', 'rejected', 'pending']) }).parse(await req.json());
  const r = await Review.findById(params.id);
  if (!r) throw new ApiError('Review not found', 404);
  const was = r.status;
  r.status = status; await r.save();
  // Fold the rating into the product's average the first time a review is approved.
  if (status === 'approved' && was !== 'approved') {
    const p = await Product.findOne({ id: r.productId });
    if (p) { p.rating = Math.round(((p.rating * p.reviews + r.rating) / (p.reviews + 1)) * 10) / 10; p.reviews += 1; await p.save(); }
  }
  return ok({ ok: true });
}, { perm: 'reviews' });

export const DELETE = route(async ({ params }) => {
  if (!mongoose.isValidObjectId(params.id)) throw new ApiError('Review not found', 404);
  await Review.findByIdAndDelete(params.id);
  return ok({ ok: true });
}, { perm: 'reviews' });
