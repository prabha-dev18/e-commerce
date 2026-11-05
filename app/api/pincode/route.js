export const dynamic = 'force-dynamic';
import { route, ok } from '@/lib/api';

// Replace the rule below with a courier serviceability API (Shiprocket, Delhivery) when you have one.
export const GET = route(async ({ req }) => {
  const code = req.nextUrl.searchParams.get('code') || '';
  if (!/^[1-8]\d{5}$/.test(code)) return ok({ serviceable: false, message: 'Enter a valid 6-digit pincode.' });
  const day = 864e5, f = (d) => new Date(Date.now() + d * day).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return ok({ serviceable: true, cod: true, message: `Delivery by ${f(3)} to ${f(5)}. Cash on delivery available.` });
}, { limit: [40, 60_000] });
