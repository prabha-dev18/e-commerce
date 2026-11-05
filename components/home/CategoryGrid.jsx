'use client';
import Link from 'next/link';
import SectionShell from '@/components/ui/SectionShell';
import DragRail from '@/components/ui/DragRail';
import ProductVisual from '@/components/product/ProductVisual';
import MaskImage from '@/components/motion/MaskImage';
import { categoryTiles } from '@/data/home';

/** A film strip: six fixed-size portraits you drag sideways. Every second one sits a little lower for rhythm. */
export default function CategoryGrid() {
  return (
    <SectionShell no={1} label="Categories" title="Shop by *category*" subtitle="Six aisles, one beautiful routine." href="/shop">
      <DragRail>
        {categoryTiles.map((c, i) => (
          <Link key={c.label} href={c.href} draggable={false} data-cursor="Drag" className={`group block w-[68vw] shrink-0 sm:w-[300px] lg:w-[330px] ${i % 2 ? 'sm:mt-12' : ''}`}>
            <div className="relative aspect-[3/4] overflow-hidden">
              <MaskImage direction="up" delay={i * 0.08} className="h-full w-full"><div className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-110"><ProductVisual src={c.image} alt={c.label} tone={c.tone} /></div></MaskImage>
              <span className="absolute left-4 top-4 font-serif text-lg text-white drop-shadow-md">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-3 border-b border-primary/20 pb-3 transition-colors duration-500 group-hover:border-accent">
              <span className="font-serif text-2xl text-primary">{c.label}</span>
              <span className="text-[11px] uppercase tracking-widest">{c.count} items</span>
            </div>
          </Link>
        ))}
      </DragRail>
    </SectionShell>
  );
}
