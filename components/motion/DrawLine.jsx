'use client';
import { motion } from 'framer-motion';

/** A hand-drawn style vertical line that draws itself as `progress` (a scroll motion value) moves from 0 to 1. */
export default function DrawLine({ progress, className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 400" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path d="M12 0 C 12 60, 20 80, 12 130 S 4 200, 12 260 S 20 330, 12 400" stroke="rgba(185,154,107,0.3)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <motion.path d="M12 0 C 12 60, 20 80, 12 130 S 4 200, 12 260 S 20 330, 12 400" stroke="#B99A6B" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength: progress }} />
    </svg>
  );
}
