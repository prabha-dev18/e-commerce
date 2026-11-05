'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/** A horizontal rail you can drag with the mouse, swipe on touch, or move with the arrows. Shows a progress line underneath. */
export default function DragRail({ children, className = '' }) {
  const ref = useRef(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: 0 });
  const [p, setP] = useState(0);
  const update = () => { const el = ref.current; if (!el) return; const max = el.scrollWidth - el.clientWidth; setP(max > 0 ? el.scrollLeft / max : 0); };
  useEffect(() => { update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, []);
  const down = (e) => { if (e.pointerType !== 'mouse') return; drag.current = { down: true, x: e.clientX, left: ref.current.scrollLeft, moved: 0 }; };
  const move = (e) => { const d = drag.current; if (!d.down) return; const dx = e.clientX - d.x; d.moved = Math.max(d.moved, Math.abs(dx)); ref.current.scrollLeft = d.left - dx; };
  const up = () => { drag.current.down = false; };
  const by = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.7, behavior: 'smooth' });
  return (
    <div className={className}>
      <div ref={ref} onScroll={update} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onClickCapture={(e) => { if (drag.current.moved > 6) { e.preventDefault(); e.stopPropagation(); drag.current.moved = 0; } }} data-cursor="Drag"
        className="flex cursor-grab select-none gap-5 overflow-x-auto pb-2 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden lg:gap-6 [&_img]:pointer-events-none">
        {children}
      </div>
      <div className="mt-8 flex items-center gap-6">
        <div className="h-px flex-1 bg-primary/15"><div className="h-px origin-left bg-accent transition-transform duration-150" style={{ transform: `scaleX(${Math.max(0.12, p)})` }} /></div>
        <div className="flex gap-2">
          <button aria-label="Previous" onClick={() => by(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 text-primary transition-all hover:bg-primary hover:text-white"><ArrowLeft size={18} /></button>
          <button aria-label="Next" onClick={() => by(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 text-primary transition-all hover:bg-primary hover:text-white"><ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}
