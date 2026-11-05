import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { siteUrl } from '@/lib/mailer';

export async function GET(req) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    await connectDB();
    const u = token && token.length > 20 ? await User.findOneAndUpdate({ verifyToken: token }, { emailVerified: true, $unset: { verifyToken: 1 } }) : null;
    return NextResponse.redirect(`${siteUrl()}/login?verified=${u ? 1 : 0}`);
  } catch (err) {
    console.error('[auth/verify]', err);
    return NextResponse.redirect(`${siteUrl()}/login?verified=0`);
  }
}
