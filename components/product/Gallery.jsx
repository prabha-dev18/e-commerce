'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Expand, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Gallery({ images, name, tone }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(null);
  const [lightbox, setLightbox] = useState(false);
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex gap-3 sm:flex-col" role="tablist" aria-label="Product images">
        {images.map((src, k) => (
          <button key={k} role="tab" aria-selected={i === k} aria-label={`Image ${k + 1}`} onClick={() => setI(k)} className={cn('h-16 w-16 overflow-hidden rounded-2xl shadow-soft ring-2 transition hover:-translate-y-0.5 sm:h-20 sm:w-20', i === k ? 'ring-accent' : 'ring-transparent opacity-70 hover:opacity-100')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
          </button>
        ))}
      </div>
      <div className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden rounded-[2rem] shadow-3d ring-1 ring-white/70" style={{ background: tone }} onMouseMove={onMove} onMouseLeave={() => setZoom(null)} onClick={() => setLightbox(true)}>
        <AnimatePresence mode="wait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img key={i} src={images[i]} alt={name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-200"
            style={zoom ? { transform: 'scale(1.9)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
        </AnimatePresence>
        <span className="glass absolute right-4 top-4 rounded-full p-2.5 text-primary"><Expand size={16} /></span>
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-primary/90 p-4" onClick={() => setLightbox(false)} role="dialog" aria-label="Image viewer">
            <button aria-label="Close" className="absolute right-5 top-5 rounded-full bg-white p-2"><X size={20} /></button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[i]} alt={name} className="max-h-full max-w-full rounded-xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
