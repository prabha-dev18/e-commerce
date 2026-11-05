'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Eye, GitCompareArrows, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import Rating from '@/components/ui/Rating';
import ProductVisual from './ProductVisual';
import { useStore } from '@/store/useStore';
import { flyToCart } from '@/lib/fly';
import { formatPrice, cn } from '@/lib/utils';

/** Card-less product: just the photograph and a few lines of type underneath. Tilt, zoom and quick actions are kept. */
export default function ProductCard({ product: p, onQuickView }) {
  const wished = useStore((s) => s.wishlist.includes(p.id));
  const compared = useStore((s) => s.compare.includes(p.id));
  const { toggleWishlist, toggleCompare, addToCart } = useStore();
  const btn = useRef(null);
  const [shade, setShade] = useState(0);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), spring);
  const move = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => { mx.set(0); my.set(0); };
  const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  const add = () => {
    flyToCart(btn.current);
    addToCart({ id: p.id, slug: p.slug, name: p.name, price: p.price }, 1, p.swatches ? `Shade ${shade + 1}` : null);
    toast.success('Added to your bag');
  };
  const action = 'flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary transition-all hover:scale-110 hover:bg-primary hover:text-white';

  return (
    <article className="group relative flex h-full flex-col">
      <motion.div onPointerMove={move} onPointerLeave={leave} style={{ rotateX, rotateY, transformPerspective: 1000 }} className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <Link href={`/product/${p.slug}`} aria-label={p.name} className="block h-full transition-transform duration-[900ms] ease-out group-hover:scale-105">
          <ProductVisual src={p.image} alt={p.name} tone={p.tone} />
        </Link>
        <div className="absolute left-0 top-3 z-[2] flex flex-col items-start gap-1">
          {off > 0 && <span className="bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">{off}% off</span>}
          {p.badge && <span className="bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">{p.badge}</span>}
        </div>
        <div className="absolute right-3 top-3 z-[2] flex flex-col gap-2 opacity-100 transition-all duration-300 md:translate-x-3 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
          <button aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wished} onClick={() => toggleWishlist(p.id)} className={action}><Heart size={16} className={cn(wished && 'fill-highlight text-highlight')} /></button>
          <button aria-label="Quick view" onClick={() => onQuickView?.(p)} className={action}><Eye size={16} /></button>
          <button aria-label="Compare" aria-pressed={compared} onClick={() => toggleCompare(p.id)} className={cn(action, compared && '!bg-accent !text-white')}><GitCompareArrows size={16} /></button>
        </div>
        <button ref={btn} onClick={add} aria-label={`Add ${p.name} to bag`} className="absolute inset-x-0 bottom-0 z-[2] flex h-11 items-center justify-center gap-2 bg-primary text-xs font-semibold uppercase tracking-widest text-white transition-transform duration-500 md:translate-y-full md:group-hover:translate-y-0"><ShoppingBag size={15} /> Add to bag</button>
      </motion.div>
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="label-sm text-accent">{p.brand}</p>
            <Link href={`/product/${p.slug}`} className="mt-1 line-clamp-2 text-sm font-medium text-primary underline-offset-4 hover:underline">{p.name}</Link>
          </div>
          <p className="shrink-0 text-right text-primary"><span className="font-serif text-lg font-bold">{formatPrice(p.price)}</span>{off > 0 && <span className="block text-xs text-body line-through">{formatPrice(p.mrp)}</span>}</p>
        </div>
        <div className="mt-1.5"><Rating value={p.rating} count={p.reviews} /></div>
        {p.swatches && (
          <div className="mt-2 flex gap-1.5">
            {p.swatches.map((c, i) => <button key={c} aria-label={`Shade ${i + 1}`} onClick={() => setShade(i)} className={cn('h-4 w-4 rounded-full ring-offset-2 transition', shade === i ? 'ring-1 ring-primary' : '')} style={{ background: c }} />)}
          </div>
        )}
      </div>
    </article>
  );
}
