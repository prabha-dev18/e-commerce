export const dynamic = 'force-dynamic';
import { crud } from '@/lib/crud';
import { pageSchema } from '@/lib/adminSchemas';
import Page from '@/models/Page';

const h = crud({ Model: Page, perm: 'pages', schema: pageSchema, sort: 'title', search: ['title', 'slug'], slugFrom: 'title' });
export const PUT = h.update;
export const DELETE = h.remove;
