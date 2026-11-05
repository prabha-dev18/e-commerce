import { clean } from './api';
import { slugify } from './adminSchemas';

const bucket = (size) => { const n = parseFloat(size); return Number.isNaN(n) ? undefined : n < 50 ? 'small' : n <= 150 ? 'medium' : 'large'; };
/** Turns validated admin input into the stored product shape (slug, hero image, discount, size bucket). */
export const toDoc = (d) => ({
  ...d, slug: d.slug || slugify(d.name), image: d.images[0], discount: d.mrp > d.price ? Math.round(((d.mrp - d.price) / d.mrp) * 100) : 0, sizeBucket: bucket(d.size),
  name: clean(d.name), brand: clean(d.brand), description: d.description && clean(d.description),
});

