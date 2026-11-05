'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import SectionShell from '@/components/ui/SectionShell';
import Magnetic from '@/components/motion/Magnetic';
import Button from '@/components/ui/Button';
import { concerns } from '@/data/home';

const about = {
  acne: 'Salicylic acid and niacinamide picks that calm breakouts and fade marks without drying you out.',
  'anti-aging': 'Retinol, peptides and rich night creams for fine lines and a firmer look.',
  hydration: 'Hyaluronic serums and barrier creams that keep skin plump through a humid day or an AC office.',
  'dull-skin': 'Vitamin C and gentle exfoliants for an even, brighter tone in a few weeks.',
  'hair-fall': 'Scalp serums, oils and strengthening masks that work together on weak roots.',
  sun: 'Light SPF 50 sunscreens with no white cast, made for Indian skin tones.',
};

/** A sentence you complete: pick your concern inside the headline and the page tints itself to match. */
export default function ConcernGrid() {
  const [a, setA] = useState(0);
  const c = concerns[a];
  return (
    <SectionShell no={5} label="Find your fix" title="Shop by *concern*" subtitle="Complete the sentence and we will show what helps.">
        <p className="max-w-5xl font-serif text-3xl leading-[1.3] sm:text-5xl sm:leading-[1.25]">
          <span className="text-primary/50">My skin and hair need help with </span>
          {concerns.map((k, i) => (
            <span key={k.slug}>
              <button onClick={() => setA(i)} onMouseEnter={() => setA(i)} data-cursor="Pick" aria-pressed={a === i} className={`relative inline-block italic transition-colors duration-300 ${a === i ? 'text-primary' : 'text-primary/30 hover:text-primary/70'}`}>
                {k.label.toLowerCase()}
                {a === i && <motion.span layoutId="concern-ul" className="absolute inset-x-0 bottom-1 h-[0.09em] bg-accent" />}
              </button>
              {i < concerns.length - 1 ? <span className="text-primary/30">, </span> : <span className="text-primary/50">.</span>}{' '}
            </span>
          ))}
        </p>
        <div className="mt-12 flex min-h-[120px] flex-wrap items-center justify-between gap-8 border-t border-primary/15 pt-8">
          <AnimatePresence mode="wait">
            <motion.p key={c.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="max-w-xl text-base sm:text-lg">{about[c.slug] || ''}</motion.p>
          </AnimatePresence>
          <Magnetic><Button href={`/shop?concern=${c.slug}`} size="lg" data-cursor="Shop">Show me what helps</Button></Magnetic>
        </div>
    </SectionShell>
  );
}
