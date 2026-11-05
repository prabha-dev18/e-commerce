export const dynamic = 'force-dynamic';
import { crud } from '@/lib/crud';
import { categorySchema } from '@/lib/adminSchemas';
import Category from '@/models/Category';

const h = crud({ Model: Category, perm: 'categories', schema: categorySchema, sort: 'order', search: ['name'], slugFrom: 'name' });
export const GET = h.list;
export const POST = h.create;
