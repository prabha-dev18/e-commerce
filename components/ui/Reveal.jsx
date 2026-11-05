'use client';
import { motion } from 'framer-motion';

export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
// Items rise and settle as they arrive. Ends with no transform at all, so fixed popups inside a Reveal still work.
export const fadeUp = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/** Fade-up on scroll. Wrap a section, or use as a stagger parent with <Reveal.Item>. */
export default function Reveal({ children, className, as = 'div', delay = 0 }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={{ hidden: fadeUp.hidden, show: { ...fadeUp.show, transition: { ...fadeUp.show.transition, delay } } }}>
      {children}
    </Tag>
  );
}

export function RevealGroup({ children, className }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
      {children}
    </motion.div>
  );
}
export function RevealItem({ children, className }) {
  return <motion.div className={className} variants={fadeUp}>{children}</motion.div>;
}
