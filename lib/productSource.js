import connectDB from './db';
import Product from '@/models/Product';
import { getBySlug } from './catalog';

const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

/** Product by slug from MongoDB; falls back to the bundled catalog if the database is not reachable. */
export async function loadProduct(slug) {
  try {
    await Promise.race([connectDB(), timeout(3000)]);
    const p = await Product.findOne({ slug, active: true }).select('-_id -__v -createdAt -updatedAt').lean();
    if (p) return JSON.parse(JSON.stringify({ ...p, images: p.images?.length ? p.images : p.image ? [p.image] : [], concern: p.concern || [], skin: p.skin?.length ? p.skin : ['all'], finish: p.finish || 'natural', size: p.size || '', swatches: p.swatches?.length ? p.swatches : undefined }));
    return null;
  } catch {
    return getBySlug(slug) || null;
  }
}
