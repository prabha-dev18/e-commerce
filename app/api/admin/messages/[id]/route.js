export const dynamic = 'force-dynamic';
import { crud } from '@/lib/crud';
import { messageSchema } from '@/lib/adminSchemas';
import ContactMessage from '@/models/ContactMessage';

const h = crud({ Model: ContactMessage, perm: 'messages', schema: messageSchema, sort: '-createdAt', search: ['name', 'email', 'subject'], slugFrom: null });
export const PUT = h.update;
export const DELETE = h.remove;
