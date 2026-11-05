export const dynamic = 'force-dynamic';
import { crud } from '@/lib/crud';
import { brandSchema } from '@/lib/adminSchemas';
import Brand from '@/models/Brand';

const h = crud({ Model: Brand, perm: 'brands', schema: brandSchema, sort: 'name', search: ['name'], slugFrom: 'name' });
export const PUT = h.update;
export const DELETE = h.remove;
