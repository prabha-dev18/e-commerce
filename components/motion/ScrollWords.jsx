'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return <motion.span style={{ opacity, y }} className="mr-[0.26em] inline-block">{children}</motion.span>;
}

/** A paragraph whose words light up one by one as you scroll past it. */
export default function ScrollWords({ text, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = String(text).split(' ');
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const start = i / words.length;
        return <Word key={i} progress={scrollYProgress} range={[start, Math.min(1, start + 1.5 / words.length)]}>{w}</Word>;
      })}
    </p>
  );
}
