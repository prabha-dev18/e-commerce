import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from './db';
import { authOptions } from './auth';
import { can } from './permissions';

import { ApiError, rateLimit } from './errors';
export { ApiError, rateLimit };
export const ok = (data, status = 200) => NextResponse.json(data, { status });
export const fail = (message, status = 400) => NextResponse.json({ error: message }, { status });

/** Strips HTML tags and control characters from user text. */
export const clean = (s = '') => String(s).replace(/<[^>]*>/g, '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function checkOrigin(req) {
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== req.headers.get('host')) throw new ApiError('Request blocked', 403);
}

/**
 * Wraps a route handler: rate limit, origin check on writes, DB connect, session, error handling.
 * options: { auth: true } needs login, { admin: true } needs admin role, { limit: [max, windowMs] }
 */
export const route = (fn, { auth = false, admin = false, perm = null, optionalAuth = false, limit = [120, 60_000] } = {}) => async (req, ctx) => {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    rateLimit(`${ip}:${req.nextUrl.pathname}`, limit[0], limit[1]);
    if (!['GET', 'HEAD'].includes(req.method)) checkOrigin(req);
    await connectDB();
    const staff = admin || !!perm;
    const session = auth || staff || optionalAuth ? await getServerSession(authOptions) : null;
    if ((auth || staff) && !session?.user?.id) throw new ApiError('Please log in to continue', 401);
    if (staff && !['admin', 'manager', 'support'].includes(session.user.role)) throw new ApiError('Not allowed', 403);
    if (perm && !can(session.user.role, perm)) throw new ApiError('You do not have access to this section', 403);
    return await fn({ req, params: ctx?.params || {}, session, ip });
  } catch (e) {
    if (e instanceof ApiError) return fail(e.message, e.status);
    if (e?.name === 'ZodError') return fail(e.issues[0]?.message || 'Invalid input', 400);
    console.error('[api]', req.nextUrl?.pathname, e);
    return fail(e?.message?.includes('MONGODB_URI') || e?.name?.startsWith('Mongo') ? 'Database is not reachable. Check MONGODB_URI.' : 'Something went wrong', 500);
  }
};
