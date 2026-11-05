'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Phone, Mail, X } from 'lucide-react';
import { categories, quickLinks } from '@/data/nav';
import { SITE_NAME } from '@/lib/utils';

const list = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } }, exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } } };
const row = { hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }, exit: { y: '110%', transition: { duration: 0.35 } } };

/** Full-screen menu. A circle of colour grows from the menu button, then the links rise into place. */
export default function FullMenu({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const key = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="menu" role="dialog" aria-modal="true" aria-label="Menu" initial={{ clipPath: 'circle(0% at 44px 44px)' }} animate={{ clipPath: 'circle(150% at 44px 44px)' }} exit={{ clipPath: 'circle(0% at 44px 44px)' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[110] overflow-y-auto bg-primary text-white">
          <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 animate-mesh-a rounded-full bg-accent/20 blur-[100px]" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 animate-mesh-b rounded-full bg-highlight/20 blur-[100px]" aria-hidden="true" />
          <div className="container-x relative flex min-h-full flex-col py-6">
            <div className="flex items-center justify-between">
              <Link href="/" onClick={onClose} className="font-serif text-3xl font-bold">{SITE_NAME}<span className="text-gold">.</span></Link>
              <button onClick={onClose} aria-label="Close menu" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition-all hover:rotate-90 hover:bg-white hover:text-primary"><X size={20} /></button>
            </div>
            <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.4fr_1fr]">
              <motion.ul variants={list} initial="hidden" animate="show" exit="exit">
                {categories.map((c, i) => (
                  <li key={c.label} className="overflow-hidden border-b border-white/10">
                    <motion.div variants={row}>
                      <Link href={c.href} onClick={onClose} className="group flex items-baseline gap-5 py-3 sm:py-4">
                        <span className="font-serif text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-serif text-4xl font-semibold transition-all duration-500 group-hover:translate-x-4 group-hover:text-accent sm:text-5xl lg:text-6xl">{c.label}</span>
                        <ArrowUpRight className="ml-auto opacity-0 transition-all duration-500 group-hover:opacity-100" size={28} />
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </motion.ul>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="space-y-8">
                <div>
                  <p className="label-sm text-accent">Explore</p>
                  <ul className="mt-4 space-y-2">
                    {quickLinks.map((l) => <li key={l.label}><Link href={l.href} onClick={onClose} className={`font-serif text-3xl transition-colors hover:text-accent ${l.highlight ? 'text-highlight' : ''}`}>{l.label}</Link></li>)}
                  </ul>
                </div>
                <div className="space-y-2 text-sm text-secondary/80">
                  <p className="label-sm text-accent">Talk to us</p>
                  <a href="tel:+919999999999" className="flex items-center gap-2 hover:text-white"><Phone size={15} /> +91 99999 99999</a>
                  <a href="mailto:care@lumiere.in" className="flex items-center gap-2 hover:text-white"><Mail size={15} /> care@lumiere.in</a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
