export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { route, ok } from '@/lib/api';
import { authOptions } from '@/lib/auth';
import { quoteSchema } from '@/lib/validations';
import { priceOrder } from '@/lib/pricing';
import { upiReady, razorpayReady } from '@/lib/razorpay';

export const POST = route(async ({ req }) => {
  const d = quoteSchema.parse(await req.json());
  const session = await getServerSession(authOptions);
  const q = await priceOrder({ ...d, userId: session?.user?.id });
  return ok({ subtotal: q.subtotal, discount: q.discount, couponCode: q.couponCode, shipping: q.shipping, tax: q.tax, total: q.total, codEnabled: q.codEnabled, upiEnabled: true, cardEnabled: true });
}, { limit: [60, 60_000] });
