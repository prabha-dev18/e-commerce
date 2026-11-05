'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Carousel from '@/components/ui/Carousel';
import ProductCard from './ProductCard';
import ProductVisual from './ProductVisual';
import QuickView from './QuickView';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { catalog, getRelated, qaFor } from '@/lib/catalog';
import { formatPrice, cn } from '@/lib/utils';

export function QA({ product }) {
  const [open, setOpen] = useState(0);
  const [q, setQ] = useState('');
  const [items, setItems] = useState(() => qaFor(product));
  const ask = (e) => { e.preventDefault(); if (!q.trim()) return; setItems([...items, { q, a: 'Thanks for asking. Our team will answer within 24 hours.' }]); setQ(''); toast.success('Question sent'); };
  return (
    <div>
      <SectionHeading title="Questions & answers" />
      <ul className="divide-y divide-secondary rounded-2xl bg-white shadow-soft">
        {items.map((it, i) => (
          <li key={i}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 p-5 text-left text-primary">{it.q}<ChevronDown size={16} className={cn('shrink-0 transition-transform', open === i && 'rotate-180')} /></button>
            {open === i && <p className="px-5 pb-5 text-sm">{it.a}</p>}
          </li>
        ))}
      </ul>
      <form onSubmit={ask} className="mt-4 flex gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask a question about this product" aria-label="Your question" className="h-11 flex-1 rounded-full bg-white px-5 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent" />
        <Button type="submit">Ask</Button>
      </form>
    </div>
  );
}

export function FrequentlyBought({ product }) {
  const mates = useMemo(() => getRelated(product, 2), [product]);
  const all = [product, ...mates];
  const [on, setOn] = useState(() => all.map((p) => p.id));
  const addToCart = useStore((s) => s.addToCart);
  const chosen = all.filter((p) => on.includes(p.id));
  const total = chosen.reduce((n, p) => n + p.price, 0);
  if (mates.length === 0) return null;
  return (
    <div>
      <SectionHeading title="Frequently bought together" />
      <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-soft md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          {all.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              {i > 0 && <Plus size={18} className="text-accent" />}
              <div className={cn('h-24 w-24 overflow-hidden rounded-xl transition-opacity', !on.includes(p.id) && 'opacity-30')}><ProductVisual src={p.image} alt={p.name} tone={p.tone} /></div>
            </div>
          ))}
        </div>
        <ul className="flex-1 space-y-2 text-sm">
          {all.map((p) => (
            <li key={p.id}><label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" checked={on.includes(p.id)} onChange={() => setOn(on.includes(p.id) ? on.filter((x) => x !== p.id) : [...on, p.id])} className="h-4 w-4 accent-[#2A211D]" />
              <span className="text-primary">{p.name}</span><span className="ml-auto">{formatPrice(p.price)}</span>
            </label></li>
          ))}
        </ul>
        <div className="md:text-right">
          <p className="text-sm">Total for {chosen.length} item{chosen.length === 1 ? '' : 's'}</p>
          <p className="font-serif text-2xl text-primary">{formatPrice(total)}</p>
          <Button className="mt-3" disabled={!chosen.length} onClick={() => { chosen.forEach((p) => addToCart({ id: p.id, slug: p.slug, name: p.name, price: p.price })); toast.success('Added to your bag'); }}>Add selected</Button>
        </div>
      </div>
    </div>
  );
}

export function ProductStrip({ title, products }) {
  const [qv, setQv] = useState(null);
  if (!products.length) return null;
  return (
    <div>
      <SectionHeading title={title} />
      <Carousel>{products.map((p) => <div key={p.id} className="w-[68%] shrink-0 sm:w-[38%] lg:w-[23.5%]"><ProductCard product={p} onQuickView={setQv} /></div>)}</Carousel>
      <QuickView product={qv} onClose={() => setQv(null)} />
    </div>
  );
}

export function Related({ product }) { return <ProductStrip title="You may also like" products={getRelated(product)} />; }
export function RecentlyViewed({ product }) {
  const recent = useStore((s) => s.recent);
  const list = recent.filter((id) => id !== product.id).map((id) => catalog.find((p) => p.id === id)).filter(Boolean);
  return <ProductStrip title="Recently viewed" products={list} />;
}
