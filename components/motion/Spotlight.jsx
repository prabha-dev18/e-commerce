'use client';
import { useRef } from 'react';

/** A soft gold light follows the cursor across the surface. Pure CSS variables, so it never re-renders React. */
export default function Spotlight({ children, className = '', color = 'rgba(185,154,107,0.22)', size = 420 }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onPointerMove={move} className={`group/spot relative ${className}`}>
      <span className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100" style={{ background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 65%)` }} aria-hidden="true" />
      {children}
    </div>
  );
}
