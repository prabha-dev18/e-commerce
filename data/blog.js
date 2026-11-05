import { IMG } from './images';

// Starter articles. Once you add posts in Admin, Blog, those are shown instead (and `npm run seed` copies these into the database).
export const blogPosts = [
  {
    slug: 'morning-skincare-routine', title: 'A five-step morning routine that works in humid weather', date: '2026-10-02T08:00:00.000Z', readTime: '4 min read', tone: '#EDE3D8', image: IMG.serum,
    excerpt: 'Heavy creams and long routines struggle in humidity. Here is a short routine that keeps skin fresh from morning to night.',
    body: `When the air is humid, skin makes more oil and heavy products feel sticky by noon. The fix is not to skip steps but to choose lighter textures.

## 1. Cleanse gently
Use a gel or foaming cleanser with lukewarm water. Avoid scrubbing, which can make skin produce even more oil.

## 2. Add a water-based serum
Vitamin C or niacinamide in a thin serum helps with dullness and shine. Apply 2 to 3 drops on damp skin and let it settle for a minute.

## 3. Moisturise lightly
Even oily skin needs moisture. A gel cream with hyaluronic acid hydrates without leaving a film.

## 4. Never skip sunscreen
Use SPF 50 with PA++++ as the last step, about two finger-lengths for face and neck. Reapply every three hours if you are outdoors.

## 5. Keep it consistent
Give any new product at least four weeks before judging it. If something stings or burns, stop using it.

- Cleanser, serum, moisturiser, sunscreen: four steps are enough on most days.
- Patch test every new product on your jawline first.`,
  },
  {
    slug: 'find-your-nude-lipstick', title: 'How to find your nude lipstick shade in under a minute', date: '2026-09-24T08:00:00.000Z', readTime: '3 min read', tone: '#F0DCD8', image: IMG.lipstick,
    excerpt: 'Nude does not mean the same colour on everyone. Use your undertone and your natural lip colour to pick the right one.',
    body: `A nude lipstick should look like your lips, only better. The trick is matching it to your undertone and your natural lip colour.

## Check your undertone
Look at the veins on your wrist in daylight. Green veins usually mean a warm undertone, blue or purple a cool one, and a mix means neutral.

## Pick the family
- Warm: peach, caramel and terracotta nudes.
- Cool: rosy pink and mauve nudes.
- Neutral: most shades work, so choose by depth.

## Match the depth
For fair skin, go one shade deeper than your lips. For medium and deep skin, go one shade lighter or add a little gloss in the centre so the colour does not look flat.

## Test it properly
Swatch on your lips, not your hand, and check in natural light. If you can wear it for a full day without touching it up, you have found your shade.`,
  },
  {
    slug: 'hair-oil-guide', title: 'Which hair oil suits your scalp: a simple guide', date: '2026-09-15T08:00:00.000Z', readTime: '5 min read', tone: '#E6DCCB', image: IMG.hairOil,
    excerpt: 'Coconut, argan, almond or castor? Match the oil to your scalp and hair type instead of following trends.',
    body: `Oil can help with dryness and breakage, but the wrong one can clog the scalp. Start with what your scalp is like.

## Oily or itchy scalp
Choose light oils such as argan or jojoba and apply only on the lengths. Oil the scalp once a week at most and wash within a few hours.

## Dry scalp
Almond or coconut oil, warmed slightly and massaged in for five minutes, helps lock in moisture. Leave it on for an hour before washing.

## Thinning or fragile hair
Add a few drops of rosemary oil to your regular oil. Massage gently. Results take two to three months, so be patient.

## How to apply
- Part your hair into sections and apply with your fingertips.
- Do not tie wet, oily hair tightly.
- Shampoo twice if the oil is heavy.

If you notice sudden hair fall, redness or flaking, see a dermatologist rather than adding more products.`,
  },
];
