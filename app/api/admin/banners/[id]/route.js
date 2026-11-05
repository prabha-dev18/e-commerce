import { crud } from '@/lib/crud';
import { bannerSchema } from '@/lib/adminSchemas';
import Banner from '@/models/Banner';

const h = crud({ Model: Banner, perm: 'banners', schema: bannerSchema, sort: 'order', search: ['title'], slugFrom: null });
export const PUT = h.update;
export const DELETE = h.remove;
