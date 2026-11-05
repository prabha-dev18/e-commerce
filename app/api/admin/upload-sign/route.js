export const dynamic = 'force-dynamic';
import crypto from 'crypto';
import { route, ok } from '@/lib/api';

// Signs a direct browser-to-Cloudinary upload. Returns { configured: false } until the Cloudinary env vars are set.
export const GET = route(async () => {
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  if (!cloud || !key || !secret) return ok({ configured: false });
  const timestamp = Math.floor(Date.now() / 1000), folder = 'lumiere';
  const signature = crypto.createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest('hex');
  return ok({ configured: true, cloudName: cloud, apiKey: key, timestamp, folder, signature });
}, { perm: 'products', limit: [60, 60_000] });
