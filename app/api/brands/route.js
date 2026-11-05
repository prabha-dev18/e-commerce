export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';
import Brand from '@/models/Brand';

export const GET = route(async () => {
  const items = await Brand.find({ active: { $ne: false } }).sort('name').select('-__v').lean();
  return ok({ items });
});
