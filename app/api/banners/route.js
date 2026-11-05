export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';
import Banner from '@/models/Banner';

export const GET = route(async () => {
  const items = await Banner.find({ active: { $ne: false } }).sort('order').select('-__v').lean();
  return ok({ items });
});
