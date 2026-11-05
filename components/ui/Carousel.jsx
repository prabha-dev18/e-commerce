'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Scroll-snap carousel. Children should have a fixed basis, e.g. className="w-[70%] sm:w-[40%] lg:w-[23%] shrink-0". */
export default function Carousel({ children, gap = 'gap-5' }) {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  const arrow = 'absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/80 text-primary shadow-3d backdrop-blur transition-all hover:scale-110 hover:bg-primary hover:text-white md:flex';
  return (
    <div className="relative">
      <button aria-label="Previous" onClick={() => scroll(-1)} className={`${arrow} -left-4`}><ChevronLeft size={20} /></button>
      <div ref={ref} className={`flex ${gap} snap-x snap-mandatory overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:snap-start`}>{children}</div>
      <button aria-label="Next" onClick={() => scroll(1)} className={`${arrow} -right-4`}><ChevronRight size={20} /></button>
    </div>
  );
}
