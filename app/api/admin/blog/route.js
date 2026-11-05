export const dynamic = 'force-dynamic';
import { crud } from '@/lib/crud';
import { blogSchema } from '@/lib/adminSchemas';
import BlogPost from '@/models/BlogPost';

const h = crud({ Model: BlogPost, perm: 'blog', schema: blogSchema, sort: '-publishedAt', search: ['title'], slugFrom: 'title' });
export const GET = h.list;
export const POST = h.create;
