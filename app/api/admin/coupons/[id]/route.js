import { crud } from '@/lib/crud';
import { couponSchema } from '@/lib/adminSchemas';
import Coupon from '@/models/Coupon';

const h = crud({ Model: Coupon, perm: 'coupons', schema: couponSchema, sort: '-createdAt', search: ['code', 'description'], slugFrom: null });
export const PUT = h.update;
export const DELETE = h.remove;
