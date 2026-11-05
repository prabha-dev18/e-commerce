import { IMG } from './images';

export const slides = [
  { eyebrow: 'New season ritual', title: 'Skin that looks like itself, only better', text: 'Serums and moisturisers picked for Indian skin and weather.', cta: 'Shop skincare', href: '/shop?category=skincare', tone: '#EDE3D8', accent: '#B99A6B' },
  { eyebrow: 'Just landed', title: 'Twelve lip shades, one perfect nude', text: 'Creamy matte and satin lipsticks that stay through chai and meetings.', cta: 'Shop makeup', href: '/shop?category=makeup', tone: '#F0DCD8', accent: '#B98282' },
  { eyebrow: 'Hair fall rescue', title: 'Stronger roots in four weeks', text: 'Scalp serums and oils that work together. Free shipping above ₹999.', cta: 'Shop hair care', href: '/shop?category=hair', tone: '#E6DCCB', accent: '#2A211D' },
  { eyebrow: 'Fragrance', title: 'Attars and mists that last all day', text: 'Alcohol-free oils and light body mists, from ₹399.', cta: 'Shop fragrance', href: '/shop?category=fragrance', tone: '#EADFD3', accent: '#B99A6B' },
];

export const categoryTiles = [
  { label: 'Skincare', href: '/shop?category=skincare', tone: '#EDE3D8', count: 128 },
  { label: 'Makeup', href: '/shop?category=makeup', tone: '#F0DCD8', count: 214 },
  { label: 'Hair', href: '/shop?category=hair', tone: '#E6DCCB', count: 86 },
  { label: 'Fragrance', href: '/shop?category=fragrance', tone: '#EADFD3', count: 64 },
  { label: 'Bath & Body', href: '/shop?category=bath-body', tone: '#E8D6CF', count: 97 },
  { label: "Men's Grooming", href: '/shop?category=mens-grooming', tone: '#DDD3C6', count: 52 },
];

export const offers = [
  { title: 'Buy 2, get 1 free', text: 'On all lip care and body butters', cta: 'Shop the offer', href: '/offers', bg: 'bg-primary text-white', sub: 'text-secondary/80' },
  { title: 'Flat 20% off serums', text: 'Vitamin C, niacinamide and retinol', cta: 'Shop serums', href: '/shop?sub=serums', bg: 'bg-highlight text-white', sub: 'text-white/85' },
  { title: 'Free mini with ₹1,499', text: 'Pick a travel-size cleanser or mist', cta: 'See details', href: '/offers', bg: 'bg-accent text-white', sub: 'text-white/90' },
];

export const products = [
  { id: 'vit-c-serum', slug: 'vitamin-c-glow-serum', brand: 'Aurelle', name: 'Vitamin C Glow Serum 30ml', price: 899, mrp: 1299, rating: 4.7, reviews: 1284, badge: 'Bestseller', tone: '#E9C9A0', shape: 'dropper', tabs: ['best', 'top'], concern: 'dull-skin' },
  { id: 'hydra-cream', slug: 'hyaluronic-hydra-cream', brand: 'Aurelle', name: 'Hyaluronic Hydra Cream 50g', price: 749, mrp: 949, rating: 4.6, reviews: 902, tone: '#F1E7DA', shape: 'jar', tabs: ['best', 'top'], concern: 'hydration' },
  { id: 'matte-lip', slug: 'velvet-matte-lipstick-rosewood', brand: 'Maison Rouge', name: 'Velvet Matte Lipstick, Rosewood', price: 599, mrp: 799, rating: 4.5, reviews: 640, badge: 'New', tone: '#B98282', shape: 'lipstick', swatches: ['#B98282', '#9C5B5B', '#C9877A', '#7A3E3E'], tabs: ['new', 'trending'] },
  { id: 'spf50', slug: 'sheer-sunscreen-spf-50', brand: 'Solene', name: 'Sheer Sunscreen SPF 50 PA++++', price: 549, mrp: 649, rating: 4.8, reviews: 2210, badge: 'Bestseller', tone: '#F4E4B8', shape: 'tube', tabs: ['best', 'top', 'trending'], concern: 'sun' },
  { id: 'niacin', slug: 'niacinamide-clarity-serum', brand: 'Pure Root', name: 'Niacinamide 10% Clarity Serum', price: 499, mrp: 699, rating: 4.4, reviews: 1530, tone: '#DCE3D6', shape: 'dropper', tabs: ['best', 'trending'], concern: 'acne' },
  { id: 'argan-oil', slug: 'argan-repair-hair-oil', brand: 'Terra', name: 'Argan Repair Hair Oil 100ml', price: 649, mrp: 849, rating: 4.6, reviews: 487, badge: 'New', tone: '#D9B98A', shape: 'bottle', tabs: ['new', 'top'], concern: 'hair-fall' },
  { id: 'rose-mist', slug: 'rose-body-mist', brand: 'Nuit', name: 'Rose & Amber Body Mist 150ml', price: 399, mrp: 499, rating: 4.3, reviews: 356, tone: '#E8C4C0', shape: 'bottle', tabs: ['new', 'trending'] },
  { id: 'kajal', slug: 'smudge-proof-kajal', brand: 'Maison Rouge', name: 'Smudge-proof Kajal, Jet Black', price: 249, mrp: 299, rating: 4.7, reviews: 3120, tone: '#3A2F2A', shape: 'pencil', tabs: ['best', 'top', 'trending'] },
  { id: 'retinol', slug: 'retinol-night-serum', brand: 'Aurelle', name: 'Retinol 0.3% Night Serum', price: 1099, mrp: 1499, rating: 4.5, reviews: 418, tone: '#E3D2BE', shape: 'dropper', tabs: ['top', 'new'], concern: 'anti-aging' },
  { id: 'body-butter', slug: 'shea-body-butter', brand: 'Terra', name: 'Shea & Cocoa Body Butter 200g', price: 599, mrp: 799, rating: 4.6, reviews: 701, tone: '#EBDCC8', shape: 'jar', tabs: ['trending', 'top'] },
  { id: 'cleanser', slug: 'gentle-gel-cleanser', brand: 'Pure Root', name: 'Gentle Gel Cleanser 150ml', price: 349, mrp: 449, rating: 4.4, reviews: 1180, tone: '#DDE6E3', shape: 'tube', tabs: ['trending', 'best'], concern: 'acne' },
  { id: 'blush', slug: 'silk-cream-blush-peach', brand: 'Maison Rouge', name: 'Silk Cream Blush, Peach Glow', price: 449, mrp: 549, rating: 4.5, reviews: 289, badge: 'New', tone: '#EBB7A3', shape: 'jar', tabs: ['new', 'trending'] },
];

export const concerns = [
  { label: 'Acne & blemishes', slug: 'acne', tone: '#DCE3D6' },
  { label: 'Anti-aging', slug: 'anti-aging', tone: '#E3D2BE' },
  { label: 'Deep hydration', slug: 'hydration', tone: '#E1ECEA' },
  { label: 'Dull skin', slug: 'dull-skin', tone: '#EBD6B8' },
  { label: 'Hair fall', slug: 'hair-fall', tone: '#E6DCCB' },
  { label: 'Sun protection', slug: 'sun', tone: '#F4E4B8' },
];

export const brands = ['Aurelle', 'Maison Rouge', 'Solene', 'Pure Root', 'Terra', 'Nuit', 'Verdant', 'Oro Beauty', 'Kaya Botanics', 'Lune'];

export const bundles = [
  { id: 'glow-set', name: 'Glow Ritual Set', items: 'Cleanser, serum, moisturiser', price: 1599, mrp: 2297, tone: '#E9C9A0' },
  { id: 'lip-duo', name: 'Nude Lip Duo', items: 'Lipstick and liner in Rosewood', price: 749, mrp: 998, tone: '#B98282' },
  { id: 'hair-kit', name: 'Hair Fall Rescue Kit', items: 'Scalp serum, oil, shampoo', price: 1399, mrp: 1947, tone: '#D9B98A' },
];

export const testimonials = [
  { name: 'Priya Shah', city: 'Ahmedabad', rating: 5, text: 'The vitamin C serum cleared my dull patches in three weeks. Packaging was neat and it arrived in two days.' },
  { name: 'Neha Verma', city: 'Pune', rating: 5, text: 'Finally a sunscreen with no white cast. I have reordered four times and the colour range of lipsticks is great too.' },
  { name: 'Ritika Desai', city: 'Surat', rating: 4, text: 'Genuine products and the support team replied on WhatsApp within minutes when I needed to change my address.' },
  { name: 'Anjali Mehta', city: 'Mumbai', rating: 5, text: 'The Glow Ritual Set made a lovely gift for my sister. She uses it every day now.' },
];

export const ugc = [];

export const posts = [
  { slug: 'morning-skincare-routine', title: 'A five-step morning routine that works in humid weather', date: '2 Oct 2026', read: '4 min read', tone: '#EDE3D8' },
  { slug: 'find-your-nude-lipstick', title: 'How to find your nude lipstick shade in under a minute', date: '24 Sep 2026', read: '3 min read', tone: '#F0DCD8' },
  { slug: 'hair-oil-guide', title: 'Which hair oil suits your scalp: a simple guide', date: '15 Sep 2026', read: '5 min read', tone: '#E6DCCB' },
];

// ---- images ----
const byId = { 'vit-c-serum': 'serum', 'hydra-cream': 'jar', 'matte-lip': 'lipstick', 'spf50': 'sunscreen', 'niacin': 'dropper', 'argan-oil': 'hairOil', 'rose-mist': 'perfume', 'kajal': 'eyes', 'retinol': 'retinol', 'body-butter': 'bodyButter', 'cleanser': 'cleanser', 'blush': 'makeup' };
products.forEach((p) => { p.image = IMG[byId[p.id]]; });
['serum', 'makeup', 'hair', 'perfume'].forEach((k, i) => { slides[i].image = IMG[k]; });
['serum', 'lipstick', 'hair', 'perfume', 'bodyButter', 'men'].forEach((k, i) => { categoryTiles[i].image = IMG[k]; });
['jar', 'lipstick', 'hairOil'].forEach((k, i) => { bundles[i].image = IMG[k]; });
['cleanser', 'makeup', 'hairOil'].forEach((k, i) => { posts[i].image = IMG[k]; });
ugc.push(...['brushes', 'serum', 'lipstick', 'spa', 'makeup', 'jar'].map((k) => IMG[k]));
