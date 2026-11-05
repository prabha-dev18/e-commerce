'use client';
import { Instagram } from 'lucide-react';
import SectionShell from '@/components/ui/SectionShell';
import ProductVisual from '@/components/product/ProductVisual';
import { ugc } from '@/data/home';

function Row({ items, reverse }) {
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className={`flex w-max gap-3 hover:[animation-play-state:paused] ${reverse ? 'animate-marquee [animation-direction:reverse] [animation-duration:55s]' : 'animate-marquee [animation-duration:45s]'}`}>
        {[0, 1].map((rep) => items.map((c, i) => (
          <a key={`${rep}-${i}`} href="#" aria-hidden={rep === 1} tabIndex={rep === 1 ? -1 : 0} aria-label="View on Instagram" data-cursor="View" className="group relative block h-44 w-44 shrink-0 overflow-hidden sm:h-56 sm:w-56">
            <div className="h-full w-full transition-transform duration-700 group-hover:scale-110"><ProductVisual src={c} alt="Customer photo" /></div>
            <span className="absolute inset-0 flex items-center justify-center bg-primary/45 opacity-0 transition-opacity group-hover:opacity-100"><Instagram className="text-white" size={26} /></span>
          </a>
        )))}
      </div>
    </div>
  );
}

/** Two endless rows of customer photos drifting in opposite directions. Pauses when you hover. */
export default function UgcGallery() {
  const a = ugc.slice(0, 3), b = ugc.slice(3, 6);
  return (
    <section className="py-16 lg:py-24" aria-label="Community photos">
      <div className="container-x mb-10 text-center">
        <p className="label-sm text-accent">Community</p>
        <p className="mt-3 font-serif text-5xl text-primary sm:text-7xl">#Lumiere<em className="text-accent">Glow</em></p>
        <a href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4" data-cursor="Follow"><Instagram size={16} /> Tag us to be featured</a>
      </div>
      <div className="space-y-3"><Row items={a.concat(b)} /><Row items={b.concat(a)} reverse /></div>
    </section>
  );
}
