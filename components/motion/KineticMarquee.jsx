'use client';
import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

const wrap = (min, max, v) => { const r = max - min; return ((((v - min) % r) + r) % r) + min; };

/** Big words that drift sideways and speed up (and reverse) with your scrolling. */
export default function KineticMarquee({ items = [], speed = 4, className = '', itemClassName = '', separator = '✦' }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const dir = useRef(-1);
  const { scrollY } = useScroll();
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < -0.05) dir.current = 1; else if (b > 0.05) dir.current = -1;
    base.set(base.get() + dir.current * (speed + Math.abs(b) * speed) * (delta / 1000));
  });
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <motion.div style={{ x }} className="flex w-max items-center">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={i} className="flex items-center">
                <span className={itemClassName}>{t}</span>
                <span className="mx-8 text-accent sm:mx-12">{separator}</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
