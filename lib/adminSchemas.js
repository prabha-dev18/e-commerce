import { z } from 'zod';

const blank = (v) => (v === '' || v === null ? undefined : v);
const num = z.preprocess(blank, z.coerce.number().min(0));
const optNum = z.preprocess(blank, z.coerce.number().min(0).optional());
const optDate = z.preprocess(blank, z.coerce.date().optional());
const slug = z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens').max(80);
const str = (n = 200) => z.string().trim().max(n);
const optStr = (n = 200) => z.preprocess(blank, str(n).optional());
export const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);

export const categorySchema = z.object({ name: str(60).min(2), slug: z.preprocess(blank, slug.optional()), image: optStr(500), order: z.preprocess(blank, z.coerce.number().default(0)), active: z.boolean().default(true) });
export const brandSchema = z.object({ name: str(60).min(2), slug: z.preprocess(blank, slug.optional()), logo: optStr(500), description: optStr(500), active: z.boolean().default(true) });
export const couponSchema = z.object({ code: str(30).min(3).transform((v) => v.toUpperCase()), description: optStr(120), type: z.enum(['percent', 'flat']), value: num, minOrder: z.preprocess(blank, z.coerce.number().min(0).default(0)), maxDiscount: optNum, expiresAt: optDate, usageLimit: optNum, firstOrderOnly: z.boolean().default(false), active: z.boolean().default(true) })
  .refine((c) => c.type !== 'percent' || c.value <= 100, { message: 'Percent cannot be more than 100', path: ['value'] });
export const bannerSchema = z.object({ eyebrow: optStr(60), title: str(120).min(2), text: optStr(240), cta: optStr(30), href: optStr(200), image: optStr(500), tone: optStr(20), placement: z.string().default('hero'), order: z.preprocess(blank, z.coerce.number().default(0)), active: z.boolean().default(true) });
export const blogSchema = z.object({ title: str(160).min(3), slug: z.preprocess(blank, slug.optional()), excerpt: optStr(300), body: optStr(20000), image: optStr(500), tone: optStr(20), readTime: optStr(20), published: z.boolean().default(true) });
export const pageSchema = z.object({ title: str(120).min(2), slug: z.preprocess(blank, slug.optional()), body: optStr(30000), published: z.boolean().default(true) });
export const messageSchema = z.object({ handled: z.boolean() });
export const settingsSchema = z.object({
  storeName: str(60).min(2), email: z.string().trim().email(), phone: optStr(30), gstPercent: z.coerce.number().min(0).max(40), codEnabled: z.boolean(),
  emailTemplates: z.object({ orderSubject: optStr(120), orderIntro: optStr(400), signature: optStr(300) }).optional(),
  homeSections: z.record(z.boolean()).optional(),
});
const list = z.preprocess((v) => (Array.isArray(v) ? v : String(v || '').split(/[\n,]/).map((x) => x.trim()).filter(Boolean)), z.array(z.string().max(300)).max(30));
export const productSchema = z.object({
  name: str(160).min(2), slug: z.preprocess(blank, slug.optional()), brand: str(60).min(1), category: str(40).min(1), sub: optStr(40),
  price: z.coerce.number().min(1).max(1e6), mrp: optNum, stock: z.coerce.number().int().min(0).max(1e6), size: optStr(30),
  images: list, description: optStr(3000), ingredients: optStr(2000), howTo: optStr(2000), benefits: list,
  concern: list, skin: list, finish: optStr(20), swatches: list, badge: optStr(20), tone: optStr(20),
  vegan: z.boolean().default(true), cf: z.boolean().default(true), pf: z.boolean().default(true), active: z.boolean().default(true),
  seo: z.object({ title: optStr(70), description: optStr(170) }).optional(),
});
