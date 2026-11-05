'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductVisual from '@/components/product/ProductVisual';
import SectionShell from '@/components/ui/SectionShell';
import { IMG } from '@/data/images';

const steps = [
  { n: '01', title: 'Cleanse', text: 'A gentle gel wash lifts the day without stripping the skin. Warm water, sixty seconds.', image: IMG.cleanser, tone: '#E1ECEA' },
  { n: '02', title: 'Treat', text: 'A serum with vitamin C or niacinamide goes on while the skin is still slightly damp.', image: IMG.serum, tone: '#EBD6B8' },
  { n: '03', title: 'Moisturise', text: 'A light cream seals everything in. Two pumps are enough for the face and neck.', image: IMG.jar, tone: '#EDE3D8' },
  { n: '04', title: 'Protect', text: 'SPF 50 as the last step, every single morning, even when it is cloudy.', image: IMG.sunscreen, tone: '#F4E4B8' },
];

/** Expanding panels: four full-height strips, the active one opens up with its photograph and the step. Cycles on its own. */
export default function RitualStory() {
  const [a, setA] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (hold) return;
    const t = setTimeout(() => setA((v) => (v + 1) % steps.length), 5000);
    return () => clearTimeout(t);
  }, [a, hold]);
  return (
    <SectionShell no={4} label="The daily ritual" title="Four steps to *glow*" subtitle="A simple morning routine, in the order it works best." href="/shop?category=skincare" linkLabel="Build my routine" tone="sand">
        <div className="flex flex-col gap-2 lg:h-[560px] lg:flex-row" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
          {steps.map((s, i) => {
            const on = a === i;
            return (
              <motion.button key={s.n} onClick={() => setA(i)} onMouseEnter={() => setA(i)} aria-expanded={on} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1, duration: 0.7 }} data-cursor="Open"
                className={`group relative overflow-hidden text-left transition-[flex,height] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${on ? 'h-[440px] lg:h-auto lg:flex-[5]' : 'h-[84px] lg:h-auto lg:flex-[1]'}`}>
                <div className={`absolute inset-0 transition-all duration-1000 ${on ? 'scale-100 opacity-100' : 'scale-110 opacity-50'}`}><ProductVisual src={s.image} alt={s.title} tone={s.tone} /></div>
                <div className={`absolute inset-0 transition-colors duration-700 ${on ? 'bg-gradient-to-t from-primary/80 via-primary/10 to-transparent' : 'bg-primary/55'}`} />
                <span className={`absolute left-5 top-5 font-serif text-xl text-accent transition-opacity ${on ? 'opacity-100' : 'opacity-100'}`}>{s.n}</span>
                <span className={`absolute font-serif text-2xl text-white transition-all duration-500 lg:[writing-mode:vertical-rl] ${on ? 'pointer-events-none opacity-0' : 'bottom-5 right-5 opacity-100 lg:bottom-6 lg:left-5 lg:right-auto'}`}>{s.title}</span>
                <div className={`absolute inset-x-0 bottom-0 p-6 transition-all duration-700 sm:p-8 ${on ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-6 opacity-0'}`}>
                  <h3 className="font-serif text-4xl !text-white sm:text-5xl">{s.title}</h3>
                  <p className="mt-3 max-w-sm text-sm text-white/85 sm:text-base">{s.text}</p>
                  {on && <motion.span className="mt-5 block h-px origin-left bg-accent" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: hold ? 0 : 5, ease: 'linear' }} key={`${a}-${hold}`} />}
                </div>
              </motion.button>
            );
          })}
        </div>
    </SectionShell>
  );
}
