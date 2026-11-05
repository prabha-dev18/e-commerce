'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionShell from '@/components/ui/SectionShell';
import ProductCard from '@/components/product/ProductCard';
import QuickView from '@/components/product/QuickView';
import { products } from '@/data/home';
import { cn } from '@/lib/utils';

const tabs = [['new', 'New arrivals'], ['best', 'Best sellers'], ['top', 'Top rated']];
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.08 } }, exit: { opacity: 0, transition: { duration: 0.2 } } };
const cell = { hidden: { opacity: 0, y: 40, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };

/** Products first: a tab row with a sliding underline, then a plain four-column grid. */
export default function ProductTabs() {
  const [tab, setTab] = useState('best');
  const [qv, setQv] = useState(null);
  const list = products.filter((p) => p.tabs.includes(tab)).slice(0, 8);
  const shown = list.length >= 8 ? list : list.slice(0, Math.max(4, list.length - (list.length % 4)));
  return (
    <SectionShell no={3} label="Favourites" title="Our *favourites*" subtitle="What people are adding to their bag this month." href="/shop" align="center">
      <div role="tablist" className="mb-10 flex justify-center gap-8 overflow-x-auto border-b border-primary/15">
        {tabs.map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn('relative shrink-0 pb-4 text-sm font-semibold uppercase tracking-[0.18em] transition-colors', tab === k ? 'text-primary' : 'text-body hover:text-primary')}>
            {l}
            {tab === k && <motion.span layoutId="tab-line" className="absolute -bottom-px left-0 h-[2px] w-full bg-accent" />}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} variants={grid} initial="hidden" animate="show" exit="exit" className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {shown.map((p) => <motion.div key={p.id} variants={cell}><ProductCard product={p} onQuickView={setQv} /></motion.div>)}
        </motion.div>
      </AnimatePresence>
      <QuickView product={qv} onClose={() => setQv(null)} />
    </SectionShell>
  );
}
