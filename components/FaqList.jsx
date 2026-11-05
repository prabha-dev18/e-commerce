'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FaqList({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="divide-y divide-secondary rounded-2xl bg-white shadow-soft">
      {items.map((f, i) => (
        <li key={f.q}>
          <h2><button id={`faq-${i}`} aria-expanded={open === i} aria-controls={`faq-p-${i}`} onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-sans text-base font-medium text-primary">
            {f.q}<ChevronDown size={18} className={cn('shrink-0 text-accent transition-transform', open === i && 'rotate-180')} />
          </button></h2>
          <div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-${i}`} hidden={open !== i} className="px-5 pb-5 text-sm leading-relaxed">{f.a}</div>
        </li>
      ))}
    </ul>
  );
}
