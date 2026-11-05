'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import SectionShell from '@/components/ui/SectionShell';
import ProductCard from '@/components/product/ProductCard';
import ProductVisual from '@/components/product/ProductVisual';
import QuickView from '@/components/product/QuickView';
import { useStore } from '@/store/useStore';
import { products } from '@/data/home';
import { formatPrice } from '@/lib/utils';

/** A chart: the number one product is shown large, the rest are a ranked list with thumbnails. */
export default function TrendingGrid() {
  const [qv, setQv] = useState(null);
  const addToCart = useStore((s) => s.addToCart);
  const list = products.filter((p) => p.tabs.includes('trending')).slice(0, 7);
  const [top, ...rest] = list;
  if (!top) return null;
  return (
    <SectionShell no={6} label="The chart" title="Trending *now*" subtitle="Most added to wishlists in the last 7 days." href="/shop?sort=popularity" tone="sand">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="mb-4 font-serif text-8xl leading-none text-outline">01</p>
          <ProductCard product={top} onQuickView={setQv} />
        </div>
        <ol className="border-t border-primary/15 lg:col-span-7">
          {rest.map((p, i) => (
            <motion.li key={p.id} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="group flex items-center gap-4 border-b border-primary/15 py-4 sm:gap-6">
              <span className="w-12 font-serif text-4xl text-outline sm:w-16 sm:text-5xl">{String(i + 2).padStart(2, '0')}</span>
              <Link href={`/product/${p.slug}`} className="h-20 w-16 shrink-0 overflow-hidden sm:h-24 sm:w-20"><div className="h-full transition-transform duration-700 group-hover:scale-110"><ProductVisual src={p.image} alt={p.name} tone={p.tone} /></div></Link>
              <div className="min-w-0 flex-1">
                <p className="label-sm text-accent">{p.brand}</p>
                <Link href={`/product/${p.slug}`} className="line-clamp-2 text-sm font-medium text-primary underline-offset-4 hover:underline sm:text-base">{p.name}</Link>
              </div>
              <p className="font-serif text-xl font-bold text-primary">{formatPrice(p.price)}</p>
              <button aria-label={`Add ${p.name} to bag`} onClick={() => { addToCart({ id: p.id, slug: p.slug, name: p.name, price: p.price }); toast.success('Added to your bag'); }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 text-primary transition-all hover:bg-primary hover:text-white"><ShoppingBag size={16} /></button>
            </motion.li>
          ))}
        </ol>
      </div>
      <QuickView product={qv} onClose={() => setQv(null)} />
    </SectionShell>
  );
}
