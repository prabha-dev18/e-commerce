import connectDB from './db';
import Page from '@/models/Page';

const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

/** An admin-written page for this slug, or null (then the built-in text is shown). */
export async function loadCms(slug) {
  try {
    await Promise.race([connectDB(), timeout(2500)]);
    const p = await Page.findOne({ slug, published: true }).select('title body').lean();
    return p ? { title: p.title, body: p.body || '' } : null;
  } catch { return null; }
}
