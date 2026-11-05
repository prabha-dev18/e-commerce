export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';
import Category from '@/models/Category';

export const GET = route(async () => {
  const items = await Category.find({ active: { $ne: false } }).sort('name').select('-__v').lean();
  return ok({ items });
});
