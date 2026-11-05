'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/** A small dot plus a soft ring that trails the mouse and grows over links and buttons. Hidden on touch screens. Add data-cursor="Label" to any element to show a label. */
export default function CursorFollower() {
  const [on, setOn] = useState(false);
  const [mode, setMode] = useState('idle'); // idle | link | label
  const [label, setLabel] = useState('');
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setOn(true);
    const move = (e) => {
      x.set(e.clientX); y.set(e.clientY);
      const t = e.target instanceof Element ? e.target : null;
      const lab = t?.closest('[data-cursor]');
      if (lab) { setMode('label'); setLabel(lab.getAttribute('data-cursor')); }
      else if (t?.closest('a,button,input,select,textarea,[role="button"],[role="tab"]')) { setMode('link'); }
      else setMode('idle');
    };
    const out = (e) => { if (!e.relatedTarget) { x.set(-100); y.set(-100); } };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerout', out);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerout', out); };
  }, [x, y]);

  if (!on) return null;
  const size = mode === 'label' ? 84 : mode === 'link' ? 56 : 34;
  return (
    <>
      <motion.div style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-[250] hidden md:block" aria-hidden="true">
        <span className="block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </motion.div>
      <motion.div style={{ x: rx, y: ry }} className="pointer-events-none fixed left-0 top-0 z-[250] hidden md:block" aria-hidden="true">
        <motion.span animate={{ width: size, height: size, backgroundColor: mode === 'label' ? 'rgba(42,33,29,0.9)' : mode === 'link' ? 'rgba(185,154,107,0.18)' : 'rgba(185,154,107,0)' }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/70 text-[11px] font-semibold uppercase tracking-widest text-white">
          {mode === 'label' ? label : ''}
        </motion.span>
      </motion.div>
    </>
  );
}
