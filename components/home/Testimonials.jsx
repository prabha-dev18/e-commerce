'use client';
import { Star } from 'lucide-react';
import SectionShell from '@/components/ui/SectionShell';
import Counter from '@/components/motion/Counter';
import { testimonials } from '@/data/home';

// Sample reviews for the demo store. Replace these with your real Google reviews.
const more = [
  { name: 'Kavya Nair', city: 'Bengaluru', rating: 5, text: 'Lipstick shades are exactly like the photos. Delivery in three days and the box felt premium.' },
  { name: 'Sana Qureshi', city: 'Hyderabad', rating: 5, text: 'The hair oil stopped my hair fall in a month. I love that every product has an authenticity check.' },
  { name: 'Meera Joshi', city: 'Jaipur', rating: 4, text: 'Good prices and easy returns. I swapped a foundation shade with no questions asked.' },
  { name: 'Divya Rao', city: 'Chennai', rating: 5, text: 'Attar is long lasting and not too strong. Will be buying the gift set for Diwali.' },
];
const all = [...testimonials, ...more];
const cols = [all.filter((_, i) => i % 3 === 0), all.filter((_, i) => i % 3 === 1), all.filter((_, i) => i % 3 === 2)];

function Review({ r }) {
  return (
    <figure className="border-t border-primary/15 py-7">
      <div className="flex gap-0.5 text-accent" aria-label={`${r.rating} out of 5`}>{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={14} className={k < r.rating ? 'fill-current' : 'opacity-30'} />)}</div>
      <blockquote className="mt-3 font-serif text-lg leading-snug text-primary">{r.text}</blockquote>
      <figcaption className="mt-3 text-xs"><b className="text-primary">{r.name}</b> · {r.city} · Posted on Google</figcaption>
    </figure>
  );
}

/** Google review wall: a big rating on the left, three columns of reviews scrolling slowly in opposite directions. */
export default function Testimonials() {
  return (
    <SectionShell no={9} label="Google reviews" title="Loved by *50,000+* customers" subtitle="Real words from people who use our products every day.">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="font-serif text-[7rem] leading-none text-primary sm:text-[9rem]"><Counter to={4.8} decimals={1} /></p>
            <div className="mt-2 flex gap-1 text-accent" aria-label="Rated 4.8 out of 5">{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={22} className="fill-current" />)}</div>
            <p className="mt-4 max-w-xs">Rated by <b className="text-primary">2,400+</b> customers on Google. Real words from people who use our products every day.</p>
          </div>
        </div>
        <div className="grid h-[620px] grid-cols-1 gap-x-10 overflow-hidden [mask-image:linear-gradient(180deg,transparent,#000_12%,#000_88%,transparent)] md:grid-cols-2 lg:col-span-8 xl:grid-cols-3">
          {cols.map((col, ci) => (
            <div key={ci} className={ci === 2 ? 'hidden xl:block' : ci === 1 ? 'hidden md:block' : ''}>
              <div className={`${ci === 1 ? 'animate-marquee-y-slow' : 'animate-marquee-y'} hover:[animation-play-state:paused]`}>
                {[0, 1].map((rep) => <div key={rep} aria-hidden={rep === 1}>{col.map((r) => <Review key={`${rep}-${r.name}`} r={r} />)}</div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
