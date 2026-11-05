export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';
import BlogPost from '@/models/BlogPost';

export const GET = route(async () => {
  const items = await BlogPost.find({ published: true }).sort('-publishedAt').select('-__v').lean();
  return ok({ items });
});
