'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/motion/Magnetic';
import MeshBackground from '@/components/motion/MeshBackground';
import SplitText from '@/components/motion/SplitText';
import ProductVisual from '@/components/product/ProductVisual';
import { slides as defaultSlides } from '@/data/home';

const DURATION = 6000;

/** Cinematic hero: giant split-text headline, an arch of imagery that wipes between slides, floating 3D objects and a mesh of drifting colour. */
export default function HeroCarousel({ slides = defaultSlides }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const n = slides.length;
  const go = (k) => setI((k + n) % n);

  // Scroll-linked parallax: image drifts down, text drifts up and fades as you leave the hero
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Mouse tilt for the stage
  const mx = useMotionValue(0), my = useMotionValue(0);
  const spring = { stiffness: 80, damping: 16, mass: 0.8 };
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), spring);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), spring);
  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5);
  };

  useEffect(() => {
    if (paused || reduce) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, reduce, n]);

  const s = slides[i];
  const next = slides[(i + 1) % n];
  return (
    <section ref={ref} className="relative isolate overflow-hidden" style={{ background: s.tone, transition: 'background-color 1s ease' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => { setPaused(false); mx.set(0); my.set(0); }} onPointerMove={onMove} aria-roledescription="carousel" aria-label="Featured offers">
      <MeshBackground />
      <div className="container-x relative grid min-h-[calc(100svh-110px)] items-center gap-6 pb-28 pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-32">
        <motion.div style={reduce ? undefined : { y: textY, opacity: textOpacity }} className="relative z-10 lg:col-span-7">
          <motion.p key={`e-${i}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="label-sm flex items-center gap-4 text-accent">
            <span className="h-px w-10 bg-accent" />{s.eyebrow}
          </motion.p>
          <h1 className="mt-6 text-[clamp(2.9rem,7.4vw,7rem)] leading-[0.95] tracking-tight" aria-live="polite">
            <SplitText key={`t-${i}`} text={s.title} immediate stagger={0.07} delay={0.2} />
          </h1>
          <motion.p key={`p-${i}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }} className="mt-8 max-w-md text-base leading-relaxed sm:text-lg">{s.text}</motion.p>
          <motion.div key={`c-${i}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }} className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic><Button href={s.href} size="lg" data-cursor="Shop">{s.cta}</Button></Magnetic>
            <Magnetic><Button href="/offers" variant="outline" size="lg">See offers</Button></Magnetic>
          </motion.div>
        </motion.div>

        {/* Stage: one tall photograph with an offset outline frame and a slowly rotating seal */}
        <div className="perspective relative mx-auto w-full max-w-[320px] sm:max-w-sm lg:col-span-5 lg:max-w-md">
          <motion.div style={reduce ? undefined : { rotateX, rotateY, y: imgY }} className="preserve-3d relative">
            <div className="absolute inset-0 border border-accent" style={{ transform: 'translateZ(-40px) translate(18px, 18px)' }} aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden" style={{ transform: 'translateZ(0)' }}>
              <AnimatePresence initial={false}>
                <motion.div key={i} className="absolute inset-0" initial={{ clipPath: 'inset(100% 0% 0% 0%)' }} animate={{ clipPath: 'inset(0% 0% 0% 0%)' }} exit={{ opacity: 0, transition: { delay: 0.9, duration: 0.4 } }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}>
                  <motion.div className="h-full w-full" initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}>
                    <ProductVisual src={s.image} alt={s.title} tone={s.tone} priority={i === 0} />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute -left-10 bottom-10 hidden h-28 w-28 sm:block" style={{ transform: 'translateZ(110px)' }} aria-hidden="true">
              <div className="animate-float h-full w-full">
                <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow"><defs><path id="seal" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs><text fontSize="9.5" letterSpacing="3" className="fill-primary" style={{ textTransform: 'uppercase' }}><textPath href="#seal">100% authentic · free delivery ·</textPath></text></svg>
                <span className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-accent">✦</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls: counter, progress segments, arrows, scroll cue */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-x flex items-center gap-6 pb-7">
          <p className="font-serif text-xl tabular-nums text-primary"><span className="text-3xl font-semibold">{String(i + 1).padStart(2, '0')}</span> <span className="text-body">/ {String(n).padStart(2, '0')}</span></p>
          <div className="flex flex-1 gap-2" role="tablist" aria-label="Slides">
            {slides.map((_, k) => (
              <button key={k} role="tab" aria-selected={k === i} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className="relative h-6 flex-1">
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary/25" />
                {k === i && <motion.span key={`${i}-${paused}`} className="absolute inset-x-0 top-1/2 h-[2px] origin-left -translate-y-1/2 bg-primary" initial={{ scaleX: 0 }} animate={{ scaleX: paused || reduce ? 1 : 1 }} transition={{ duration: paused || reduce ? 0 : DURATION / 1000, ease: 'linear' }} />}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button aria-label="Previous slide" onClick={() => go(i - 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 text-primary transition-all hover:bg-primary hover:text-white"><ArrowLeft size={18} /></button>
            <button aria-label="Next slide" onClick={() => go(i + 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 text-primary transition-all hover:bg-primary hover:text-white"><ArrowRight size={18} /></button>
          </div>
          <div className="hidden items-center gap-3 lg:flex" aria-hidden="true"><span className="label-sm text-body">Scroll</span><span className="h-12 w-px overflow-hidden bg-primary/20"><span className="block h-full w-full animate-scroll-cue bg-primary" /></span></div>
        </div>
      </div>
    </section>
  );
}
