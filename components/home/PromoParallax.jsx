'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/motion/Magnetic';
import SplitText from '@/components/motion/SplitText';
import MeshBackground from '@/components/motion/MeshBackground';

export default function PromoParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-14%', '14%']);
  const ring = useTransform(scrollYProgress, [0, 1], [0, 160]);
  return (
    <section ref={ref} className="relative overflow-hidden bg-primary">
      <motion.div style={{ y }} className="absolute -inset-y-[18%] inset-x-0"><MeshBackground dark /></motion.div>
      <motion.div style={{ rotate: ring }} className="pointer-events-none absolute -right-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full border border-accent/30" aria-hidden="true"><span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" /></motion.div>
      <div className="container-x relative flex min-h-[460px] flex-col items-center justify-center py-20 text-center">
        <p className="label-sm text-gold">Members only</p>
        <SplitText as="h2" text="Earn a point on every ₹10 you spend" className="text-gold-flow mt-5 max-w-3xl text-4xl leading-[1.05] sm:text-6xl lg:text-7xl" />
        <p className="mt-6 max-w-md text-secondary/85">Points turn into discounts on your next order. Joining takes a minute.</p>
        <Magnetic className="mt-10 inline-block"><Button href="/account" variant="soft" size="lg" data-cursor="Join">Join Lumière Circle</Button></Magnetic>
      </div>
    </section>
  );
}
