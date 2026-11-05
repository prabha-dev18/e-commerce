'use client';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/** Moves its content at a different speed from the page while it crosses the screen. distance is in pixels. */
export default function Parallax({ children, distance = 60, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return <div ref={ref} className={className}><motion.div style={reduce ? undefined : { y }} className="h-full w-full">{children}</motion.div></div>;
}
