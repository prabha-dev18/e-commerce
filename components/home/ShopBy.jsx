'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionShell from '@/components/ui/SectionShell';
import { CategoryStrip } from './CategoryGrid';
import { ConcernPicker } from './ConcernGrid';
import { cn } from '@/lib/utils';

/** Shop by category and shop by concern live in one section with two tabs. showConcerns hides the second tab (admin toggle). */
export default function ShopBy({ showConcerns = true }) {
  const tabs = [['cat', 'Category'], ...(showConcerns ? [['con', 'Concern']] : [])];
  const [tab, setTab] = useState('cat');
  return (
    <SectionShell label="Shop" title="Shop by *category* or concern" href="/shop">
      {tabs.length > 1 && (
        <div role="tablist" className="mb-6 inline-flex gap-1 border border-primary/15 p-1">
          {tabs.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn('relative px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors', tab === k ? 'text-white' : 'text-body hover:text-primary')}>
              {tab === k && <motion.span layoutId="shopby-pill" className="absolute inset-0 bg-primary" />}
              <span className="relative">By {l}</span>
            </button>
          ))}
        </div>
      )}
      {tab === 'cat' ? <CategoryStrip /> : <ConcernPicker />}
    </SectionShell>
  );
}
