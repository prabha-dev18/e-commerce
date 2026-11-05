'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { categories, quickLinks } from '@/data/nav';
import { cn } from '@/lib/utils';

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function CategoryNav() {
  const [active, setActive] = useState(null);
  const current = categories.find((c) => c.label === active);

  return (
    <nav className="relative hidden border-t border-secondary/70 lg:block" onMouseLeave={() => setActive(null)} aria-label="Shop categories">
      <ul className="container-x flex h-12 items-center gap-8">
        {categories.map((c) => (
          <li key={c.label} onMouseEnter={() => setActive(c.label)} className="relative">
            <Link href={c.href} className="relative flex items-center gap-1 text-sm font-medium text-primary">
              {c.label} <ChevronDown size={14} className={cn('transition-transform', active === c.label && 'rotate-180')} />
            </Link>
            {active === c.label && <motion.span layoutId="nav-indicator" transition={{ type: 'spring', stiffness: 420, damping: 34 }} className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gold-sheen" />}
          </li>
        ))}
        <li className="ml-auto flex items-center gap-8">
          {quickLinks.map((l) => (
            <Link key={l.label} href={l.href} onMouseEnter={() => setActive(null)} className={cn('nav-link', l.highlight && '!text-highlight')}>{l.label}</Link>
          ))}
        </li>
      </ul>

      <AnimatePresence>
        {current && (
          <motion.div
            key="panel" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-40 border-t border-accent/30 bg-white/95 shadow-lift backdrop-blur-xl"
          >
            <div className="container-x grid grid-cols-12 gap-8 py-8">
              <div className="col-span-8 grid grid-cols-3 gap-8">
                {current.columns.map((col) => (
                  <div key={col.title}>
                    <h3 className="label-sm mb-3 !font-sans text-accent">{col.title}</h3>
                    <ul className="space-y-2">
                      {col.links.map((l) => (
                        <li key={l}><Link href={`${current.href}&sub=${slug(l)}`} onClick={() => setActive(null)} className="text-sm text-body transition-colors hover:text-primary">{l}</Link></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Link href={current.featured.href} onClick={() => setActive(null)} className="group sheen relative col-span-4 flex min-h-[190px] flex-col justify-end overflow-hidden rounded-3xl bg-secondary p-6 shadow-3d transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <div className="absolute inset-0 bg-blush opacity-80 transition-transform duration-700 group-hover:scale-110" />
                <Sparkles className="absolute right-5 top-5 text-accent" size={22} />
                <div className="relative">
                  <h3 className="text-2xl">{current.featured.title}</h3>
                  <p className="mt-1 text-sm">{current.featured.text}</p>
                  <span className="nav-link mt-3 inline-block" data-active="true">Shop now</span>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
