// Catalog data layer. Phase 4 replaces these functions with calls to /api/products.
import { products as homeProducts } from '@/data/home';
import { IMG } from '@/data/images';

const extra = {
  'vit-c-serum': { category: 'skincare', sub: 'serums', skin: ['all', 'oily', 'combination'], finish: 'dewy', size: '30ml' },
  'hydra-cream': { category: 'skincare', sub: 'moisturisers', skin: ['dry', 'normal'], finish: 'dewy', size: '50g' },
  'matte-lip': { category: 'makeup', sub: 'lipstick', finish: 'matte', size: '3.5g' },
  spf50: { category: 'skincare', sub: 'sunscreen', skin: ['all', 'oily'], size: '50ml' },
  niacin: { category: 'skincare', sub: 'serums', skin: ['oily', 'combination'], size: '30ml' },
  'argan-oil': { category: 'hair', sub: 'hair-oils', size: '100ml' },
  'rose-mist': { category: 'fragrance', sub: 'body-mists', size: '150ml' },
  kajal: { category: 'makeup', sub: 'eyeliner', finish: 'matte', size: '0.35g' },
  retinol: { category: 'skincare', sub: 'serums', skin: ['normal', 'combination', 'dry'], size: '30ml' },
  'body-butter': { category: 'bath-body', sub: 'body-butter', skin: ['dry'], size: '200g' },
  cleanser: { category: 'skincare', sub: 'cleansers', skin: ['oily', 'combination'], size: '150ml' },
  blush: { category: 'makeup', sub: 'blush', finish: 'dewy', size: '5g' },
};

const nude = ['#F1D3B8', '#E3B999', '#C99772', '#9C6B4A'];
const more = [
  { id: 'shampoo', brand: 'Terra', name: 'Anti Hair Fall Shampoo 250ml', price: 349, mrp: 449, rating: 4.4, reviews: 612, tone: '#E6DCCB', img: 'hair', category: 'hair', sub: 'shampoo', concern: ['hair-fall'], size: '250ml' },
  { id: 'hair-mask', brand: 'Terra', name: 'Deep Repair Hair Mask 200g', price: 549, mrp: 699, rating: 4.5, reviews: 301, tone: '#D9B98A', img: 'hairOil', category: 'hair', sub: 'hair-masks', size: '200g' },
  { id: 'foundation', brand: 'Maison Rouge', name: 'Skin Veil Foundation 30ml', price: 799, mrp: 999, rating: 4.3, reviews: 540, badge: 'New', tone: '#E3B999', img: 'makeup', category: 'makeup', sub: 'foundation', swatches: nude, size: '30ml', skin: ['all'] },
  { id: 'mascara', brand: 'Maison Rouge', name: 'Lash Lift Mascara, Black', price: 449, mrp: 549, rating: 4.4, reviews: 877, tone: '#3A2F2A', img: 'eyes', category: 'makeup', sub: 'mascara', finish: 'matte', size: '9ml' },
  { id: 'eau-parfum', brand: 'Nuit', name: 'Amber Noir Eau de Parfum 50ml', price: 1499, mrp: 1999, rating: 4.7, reviews: 233, badge: 'Bestseller', tone: '#E8C4C0', img: 'perfume', category: 'fragrance', sub: 'eau-de-parfum', size: '50ml' },
  { id: 'attar', brand: 'Oro Beauty', name: 'Sandal & Oud Attar 10ml', price: 699, mrp: 899, rating: 4.6, reviews: 189, tone: '#D9B98A', img: 'perfume', category: 'fragrance', sub: 'attars', size: '10ml' },
  { id: 'face-mask', brand: 'Verdant', name: 'Hydrating Clay Face Mask 100g', price: 399, mrp: 499, rating: 4.3, reviews: 410, tone: '#DCE3D6', img: 'spa', category: 'skincare', sub: 'face-masks', concern: ['hydration'], skin: ['all'], size: '100g' },
  { id: 'eye-cream', brand: 'Aurelle', name: 'Peptide Eye Cream 15g', price: 849, mrp: 1099, rating: 4.5, reviews: 266, tone: '#F1E7DA', img: 'jar', category: 'skincare', sub: 'eye-creams', concern: ['anti-aging'], skin: ['normal', 'dry'], size: '15g' },
  { id: 'body-wash', brand: 'Kaya Botanics', name: 'Honey & Oat Body Wash 300ml', price: 299, mrp: 379, rating: 4.4, reviews: 520, tone: '#EBDCC8', img: 'spa', category: 'bath-body', sub: 'body-wash', size: '300ml' },
  { id: 'shaving-cream', brand: 'Lune', name: 'Sensitive Shaving Cream 100g', price: 249, mrp: 299, rating: 4.4, reviews: 340, tone: '#DDD3C6', img: 'men', category: 'mens-grooming', sub: 'shaving-cream', size: '100g' },
  { id: 'beard-oil', brand: 'Lune', name: 'Cedarwood Beard Oil 30ml', price: 399, mrp: 499, rating: 4.6, reviews: 298, badge: 'New', tone: '#D9B98A', img: 'men', category: 'mens-grooming', sub: 'beard-oil', size: '30ml' },
  { id: 'lip-balm', brand: 'Verdant', name: 'Berry Tinted Lip Balm 4g', price: 199, mrp: 249, rating: 4.5, reviews: 1020, tone: '#E8C4C0', img: 'lipstick', category: 'skincare', sub: 'lip-balms', size: '4g' },
  { id: 'glow-set', slug: 'glow-ritual-set', brand: 'Aurelle', name: 'Glow Ritual Set', price: 1599, mrp: 2297, rating: 4.8, reviews: 154, badge: 'Bestseller', tone: '#E9C9A0', img: 'jar', category: 'gift-sets', sub: 'sets', size: '3 pcs' },
  { id: 'lip-duo', slug: 'nude-lip-duo', brand: 'Maison Rouge', name: 'Nude Lip Duo', price: 749, mrp: 998, rating: 4.6, reviews: 98, tone: '#B98282', img: 'lipstick', category: 'gift-sets', sub: 'sets', size: '2 pcs' },
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const base = { concern: [], skin: ['all'], finish: 'natural', vegan: true, cf: true, pf: true, stock: 40 };

export const catalog = [
  ...homeProducts.map((p) => ({ ...base, ...p, ...extra[p.id], concern: p.concern ? [p.concern] : [] })),
  ...more.map((m) => ({ ...base, ...m, slug: m.slug || slugify(m.name), image: IMG[m.img] })),
].map((p, i) => ({
  ...p,
  sku: `LUM-${String(1000 + i)}`,
  created: p.badge === 'New' ? 100 + i : i,
  pop: p.reviews,
  stock: p.id === 'attar' ? 0 : p.id === 'retinol' ? 6 : 40,
  vegan: !['eau-parfum', 'hair-mask'].includes(p.id),
  pf: p.id !== 'shampoo',
  images: [p.image, IMG.brushes, IMG.spa].filter(Boolean),
}));

export const getBySlug = (slug) => catalog.find((p) => p.slug === slug);
export const getRelated = (p, n = 8) => catalog.filter((x) => x.id !== p.id && (x.category === p.category || x.brand === p.brand)).slice(0, n);

export const shadeFamilies = [
  { name: 'Light', hex: nude[0] }, { name: 'Medium', hex: nude[1] }, { name: 'Tan', hex: nude[2] }, { name: 'Deep', hex: nude[3] },
  { name: 'Nude', hex: '#C9877A' }, { name: 'Rose', hex: '#B98282' }, { name: 'Berry', hex: '#9C5B5B' }, { name: 'Brown', hex: '#7A3E3E' },
];
export const facets = {
  category: [['skincare', 'Skincare'], ['makeup', 'Makeup'], ['hair', 'Hair'], ['fragrance', 'Fragrance'], ['bath-body', 'Bath & Body'], ['mens-grooming', "Men's Grooming"], ['gift-sets', 'Gift Sets']],
  brand: [...new Set(catalog.map((p) => p.brand))].sort().map((b) => [b, b]),
  skin: [['all', 'All skin'], ['oily', 'Oily'], ['dry', 'Dry'], ['combination', 'Combination'], ['normal', 'Normal']],
  concern: [['acne', 'Acne'], ['anti-aging', 'Anti-aging'], ['hydration', 'Hydration'], ['dull-skin', 'Dull skin'], ['hair-fall', 'Hair fall'], ['sun', 'Sun protection']],
  finish: [['matte', 'Matte'], ['dewy', 'Dewy'], ['natural', 'Natural']],
  size: [['small', 'Small (under 50)'], ['medium', 'Medium (50 to 150)'], ['large', 'Large (150+)']],
  sort: [['popularity', 'Popularity'], ['newest', 'Newest'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['rating', 'Top rated']],
};

const sizeBucket = (p) => { const n = parseFloat(p.size); return n < 50 ? 'small' : n <= 150 ? 'medium' : 'large'; };
const list = (v) => (v ? v.split(',').filter(Boolean) : []);
export const discountOf = (p) => (p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0);

/** params: plain object of strings (comma-separated for multi values). */
export function filterProducts(params = {}) {
  const q = (params.q || '').toLowerCase().trim();
  const [cat, sub, brand, skin, concern, finish, size, shade] = ['category', 'sub', 'brand', 'skin', 'concern', 'finish', 'size', 'shade'].map((k) => list(params[k]));
  const min = Number(params.min) || 0;
  const max = Number(params.max) || Infinity;
  const hexes = shade.map((n) => shadeFamilies.find((s) => s.name === n)?.hex).filter(Boolean);

  let out = catalog.filter((p) =>
    (!q || `${p.name} ${p.brand} ${p.category} ${p.sub}`.toLowerCase().includes(q)) &&
    (!cat.length || cat.includes(p.category)) &&
    (!sub.length || sub.includes(p.sub)) &&
    (!brand.length || brand.includes(p.brand)) &&
    (!skin.length || p.skin.some((s) => skin.includes(s))) &&
    (!concern.length || p.concern.some((c) => concern.includes(c))) &&
    (!finish.length || finish.includes(p.finish)) &&
    (!size.length || size.includes(sizeBucket(p))) &&
    (!hexes.length || p.swatches?.some((h) => hexes.includes(h))) &&
    p.price >= min && p.price <= max &&
    (!params.rating || p.rating >= Number(params.rating)) &&
    (!params.discount || discountOf(p) >= Number(params.discount)) &&
    (params.stock !== '1' || p.stock > 0) &&
    (params.vegan !== '1' || p.vegan) && (params.cf !== '1' || p.cf) && (params.pf !== '1' || p.pf)
  );
  const sorters = { popularity: (a, b) => b.pop - a.pop, newest: (a, b) => b.created - a.created, 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating };
  return out.sort(sorters[params.sort] || sorters.popularity);
}

// ---- product detail content (replaced by DB fields in Phase 4) ----
const copy = {
  skincare: { ing: 'Aqua, Glycerin, Niacinamide, Sodium Hyaluronate, Panthenol, Aloe Barbadensis Leaf Juice, Tocopherol, Phenoxyethanol.', how: 'Apply on clean skin morning and night. Use a pea-sized amount for face and neck, then follow with moisturiser. Use sunscreen in the day.', ben: ['Visible glow in 2 to 3 weeks', 'Lightweight, non-sticky finish', 'Suitable for daily use', 'Dermatologically tested'] },
  makeup: { ing: 'Cyclopentasiloxane, Isododecane, Mica, Dimethicone, Tocopheryl Acetate, Shea Butter, Iron Oxides.', how: 'Apply directly or with a brush, starting from the centre and blending outward. Build coverage in thin layers. Remove with a cleansing balm at night.', ben: ['Long wear up to 10 hours', 'Comfortable, no dryness', 'True-to-pan colour payoff', 'Cruelty-free formula'] },
  hair: { ing: 'Aqua, Argania Spinosa Kernel Oil, Cetearyl Alcohol, Biotin, Panthenol, Rosemary Extract, Fragrance.', how: 'Apply on damp hair from roots to ends. Leave for 3 minutes (masks: 10 minutes), then rinse. Use 2 to 3 times a week.', ben: ['Reduces breakage', 'Adds shine and softness', 'Free from sulphates', 'Light, non-greasy feel'] },
  fragrance: { ing: 'Alcohol Denat., Parfum, Aqua, Linalool, Limonene, Benzyl Benzoate.', how: 'Spray 15 cm away on pulse points: wrists, neck and behind the ears. Do not rub. Store away from heat and direct sunlight.', ben: ['6 to 8 hours of wear', 'Balanced top, heart and base notes', 'Travel-friendly bottle'] },
  'bath-body': { ing: 'Aqua, Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Glycerin, Tocopherol, Parfum.', how: 'Massage onto damp skin and rinse (washes), or apply on dry skin after bathing (butters and lotions).', ben: ['Softens skin for 24 hours', 'Gentle on sensitive skin', 'Natural butters and oils'] },
  'mens-grooming': { ing: 'Aqua, Glycerin, Stearic Acid, Cedrus Atlantica Bark Oil, Panthenol, Allantoin.', how: 'Apply a small amount to clean, damp skin or beard. Massage in and shave or style as usual.', ben: ['Smooth, comfortable shave', 'Calms razor burn', 'Clean woody scent'] },
  'gift-sets': { ing: 'See individual product labels inside the box.', how: 'Each product has usage steps on its pack. The set card inside shows the recommended order.', ben: ['Gift-ready box', 'Save up to 30%', 'Full-size products'] },
};
export const details = (p) => {
  const c = copy[p.category] || copy.skincare;
  return {
    description: p.description || `${p.name} by ${p.brand} is made for everyday use and Indian weather. It is ${p.vegan ? 'vegan, ' : ''}${p.pf ? 'paraben-free, ' : ''}and tested for comfort. Size: ${p.size}.`,
    ingredients: p.ingredients || c.ing, howTo: p.howTo || c.how, benefits: p.benefits?.length ? p.benefits : c.ben,
    sizes: [{ label: p.size || 'Standard', price: p.price }, { label: `Value pack (2 x ${p.size || 'pack'})`, price: Math.round(p.price * 1.8) }],
  };
};
const names = ['Priya S.', 'Neha V.', 'Ritika D.', 'Anjali M.', 'Kavya R.', 'Sana K.'];
const texts = ['Works well for my skin and the packaging is lovely.', 'Good quality. Delivery took two days and everything was sealed.', 'I have reordered this twice now. Would recommend.', 'Nice texture, absorbs quickly. Wish the pack was a bit bigger.', 'Exactly as described. Great value at this price.', 'Decent product, but the fragrance is slightly strong for me.'];
export const reviewsFor = (p) => names.map((n, i) => ({ id: `${p.id}-${i}`, name: n, rating: Math.max(3, Math.min(5, Math.round(p.rating + (i % 3 === 2 ? -1 : 0)))), text: texts[i], date: `${i + 2} Oct 2026`, verified: i !== 5, helpful: 12 - i * 2 }));
export const distribution = (p) => { const five = Math.round(Math.min(85, Math.max(40, 40 + (p.rating - 4) * 60))); const rest = 100 - five; const four = Math.round(rest * 0.55); const three = Math.round(rest * 0.25); const two = Math.round(rest * 0.1); return [five, four, three, two, rest - four - three - two]; }; // index 0 = 5 stars
export const qaFor = (p) => [{ q: 'Is this suitable for sensitive skin?', a: `Yes, ${p.name} is dermatologically tested. We still suggest a patch test first.` }, { q: 'Is it original and sealed?', a: 'Every product is sourced directly from the brand and ships sealed with a batch code.' }, { q: 'What is the shelf life?', a: 'Up to 24 months from manufacture. The date is printed on the pack.' }];
