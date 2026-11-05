'use client';
import { motion, useReducedMotion } from 'framer-motion';

const from = {
  up: 'inset(100% 0% 0% 0%)', down: 'inset(0% 0% 100% 0%)', left: 'inset(0% 100% 0% 0%)', right: 'inset(0% 0% 0% 100%)', circle: 'circle(0% at 50% 50%)',
};
const to = { circle: 'circle(75% at 50% 50%)' };

/** Clip-path reveal: the picture is uncovered like a curtain while it slowly scales down (a cinematic image reveal). */
export default function MaskImage({ children, direction = 'up', delay = 0, duration = 1.2, className = '', zoom = true }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial={{ clipPath: from[direction] }} whileInView={{ clipPath: to[direction] || 'inset(0% 0% 0% 0%)' }} viewport={{ once: true, margin: '-80px' }} transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}>
      <motion.div className="h-full w-full" initial={{ scale: zoom ? 1.3 : 1 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: duration * 1.4, delay, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
