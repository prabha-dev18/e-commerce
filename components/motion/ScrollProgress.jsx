'use client';
import { motion, useScroll, useSpring } from 'framer-motion';

/** A thin gold line at the very top that fills as you read down the page. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[120] h-[3px] origin-left bg-gold-sheen" aria-hidden="true" />;
}
