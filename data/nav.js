export const categories = [
  {
    label: 'Skincare', href: '/shop?category=skincare',
    columns: [
      { title: 'Face', links: ['Cleansers', 'Serums', 'Moisturisers', 'Sunscreen', 'Face Masks'] },
      { title: 'Eyes & Lips', links: ['Eye Creams', 'Lip Balms', 'Lip Masks'] },
      { title: 'Concern', links: ['Acne', 'Anti-aging', 'Hydration', 'Dull Skin'] },
    ],
    featured: { title: 'Glow Ritual Set', text: 'Cleanser, serum and moisturiser in one box.', href: '/shop?category=gift-sets' },
  },
  {
    label: 'Makeup', href: '/shop?category=makeup',
    columns: [
      { title: 'Face', links: ['Foundation', 'Concealer', 'Blush', 'Highlighter', 'Powder'] },
      { title: 'Eyes', links: ['Mascara', 'Eyeliner', 'Eyeshadow', 'Brows'] },
      { title: 'Lips', links: ['Lipstick', 'Lip Gloss', 'Lip Liner', 'Tints'] },
    ],
    featured: { title: 'New Nude Edit', text: '12 lipstick shades for every skin tone.', href: '/shop?category=makeup&sort=newest' },
  },
  {
    label: 'Hair', href: '/shop?category=hair',
    columns: [
      { title: 'Care', links: ['Shampoo', 'Conditioner', 'Hair Masks', 'Hair Oils'] },
      { title: 'Style', links: ['Serums', 'Heat Protect', 'Styling Creams'] },
    ],
    featured: { title: 'Hair Fall Rescue', text: 'Scalp and strand care that works together.', href: '/shop?concern=hair-fall' },
  },
  {
    label: 'Fragrance', href: '/shop?category=fragrance',
    columns: [
      { title: 'For Her', links: ['Eau de Parfum', 'Body Mists', 'Roll-ons'] },
      { title: 'For Him', links: ['Eau de Toilette', 'Deodorants'] },
      { title: 'Unisex', links: ['Attars', 'Discovery Sets'] },
    ],
    featured: { title: 'Attar Collection', text: 'Alcohol-free, long-lasting oils.', href: '/shop?category=fragrance&type=attar' },
  },
  {
    label: 'Bath & Body', href: '/shop?category=bath-body',
    columns: [
      { title: 'Bath', links: ['Body Wash', 'Bath Salts', 'Soaps'] },
      { title: 'Body', links: ['Body Lotion', 'Body Butter', 'Scrubs', 'Hand Cream'] },
    ],
    featured: { title: 'Self-care Sunday', text: 'Bath and body bundles under ₹1,499.', href: '/shop?category=bath-body' },
  },
  {
    label: "Men's Grooming", href: '/shop?category=mens-grooming',
    columns: [
      { title: 'Shave', links: ['Shaving Cream', 'Aftershave', 'Razors'] },
      { title: 'Care', links: ['Face Wash', 'Beard Oil', 'Moisturiser'] },
    ],
    featured: { title: 'Beard Essentials', text: 'Oil, balm and comb starter kit.', href: '/shop?category=mens-grooming' },
  },
];

export const quickLinks = [
  { label: 'Gift Sets', href: '/shop?category=gift-sets' },
  { label: 'Brands', href: '/brands' },
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Offers', href: '/offers', highlight: true },
];

export const searchSuggestions = [
  'Vitamin C serum', 'Hyaluronic moisturiser', 'Matte lipstick', 'SPF 50 sunscreen', 'Kajal',
  'Argan hair oil', 'Rose body mist', 'Niacinamide serum', 'Foundation', 'Face wash',
];
