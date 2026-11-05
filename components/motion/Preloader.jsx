'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SITE_NAME } from '@/lib/utils';

/** Luxury intro: the wordmark rises letter by letter, a gold line fills, then the curtain lifts. Shown once per visit. */
export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('lumiere-intro') === '1'; } catch { /* private mode: just show it */ }
    if (seen || reduce) return;
    setShow(true);
    try { sessionStorage.setItem('lumiere-intro', '1'); } catch { /* ignore */ }
    document.body.style.overflow = 'hidden';
    const start = performance.now(), total = 1900;
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / total);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => { setShow(false); document.body.style.overflow = ''; }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = ''; };
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div key="pre" className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-primary text-white" exit={{ y: '-100%', borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} role="status" aria-label="Loading">
          <div className="flex overflow-hidden pb-2 font-serif text-6xl font-semibold tracking-wide sm:text-8xl" aria-hidden="true">
            {SITE_NAME.split('').map((c, i) => (
              <motion.span key={i} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.1 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="inline-block">{c}</motion.span>
            ))}
            <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.1 + SITE_NAME.length * 0.07, duration: 0.8 }} className="text-gold inline-block">.</motion.span>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="label-sm mt-4 text-secondary/70">Premium beauty</motion.p>
          <div className="mt-10 h-px w-48 overflow-hidden bg-white/15 sm:w-72"><div className="h-full bg-gold-sheen" style={{ width: `${pct}%` }} /></div>
          <p className="mt-3 font-serif text-sm tabular-nums text-secondary/70">{String(pct).padStart(3, '0')}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
