'use client';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Text that reveals word by word (or letter by letter) from behind a mask, with an optional blur-to-clear.
 * Props: text, as ('h1', 'h2', 'p', 'span'), by ('word' | 'char'), delay, stagger, blur, immediate (play on load instead of on scroll).
 */
export default function SplitText({ text = '', as = 'span', by = 'word', delay = 0, stagger = 0.06, blur = true, immediate = false, className = '', itemClassName = '' }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.span;
  const words = String(text).split(' ');
  const plain = String(text).replace(/\*/g, '');
  const isEm = (w) => w.length > 2 && w.startsWith('*') && w.endsWith('*');
  const clean = (w) => w.replace(/\*/g, '');
  if (reduce) return <Tag className={className}>{words.map((w, i) => (isEm(w) ? <em key={i} className="italic text-accent">{clean(w)} </em> : `${clean(w)} `))}</Tag>;

  const item = {
    hidden: { y: '115%', opacity: 0, rotate: 3, ...(blur ? { filter: 'blur(8px)' } : {}) },
    show: { y: '0%', opacity: 1, rotate: 0, ...(blur ? { filter: 'blur(0px)' } : {}), transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };
  const parent = { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } };
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '-60px' } };

  return (
    <Tag className={className} aria-label={plain} initial="hidden" variants={parent} {...trigger}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block overflow-hidden pb-[0.14em] align-bottom" aria-hidden="true" style={{ marginRight: '0.26em' }}>
          {by === 'char'
            ? clean(w).split('').map((c, ci) => <motion.span key={ci} variants={item} className={`inline-block ${itemClassName} ${isEm(w) ? 'italic text-accent' : ''}`}>{c}</motion.span>)
            : <motion.span variants={item} className={`inline-block ${itemClassName} ${isEm(w) ? 'italic text-accent' : ''}`}>{clean(w)}</motion.span>}
        </span>
      ))}
    </Tag>
  );
}
