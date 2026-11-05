'use client';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Badge from '@/components/ui/Badge';
import Rating from '@/components/ui/Rating';
import ProductVisual from './ProductVisual';
import { useStore } from '@/store/useStore';
import { discountOf } from '@/lib/catalog';
import { formatPrice, cn } from '@/lib/utils';

export default function ProductRow({ product: p, onQuickView }) {
  const wished = useStore((s) => s.wishlist.includes(p.id));
  const { toggleWishlist, addToCart } = useStore();
  const off = discountOf(p);
  return (
    <article className="flex gap-4 overflow-hidden rounded-2xl bg-white p-3 shadow-soft sm:gap-6 sm:p-4">
      <Link href={`/product/${p.slug}`} className="relative block aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-xl sm:w-44">
        <ProductVisual src={p.image} alt={p.name} tone={p.tone} />
        {off > 0 && <Badge tone="sale" className="absolute left-2 top-2">{off}% off</Badge>}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <p className="label-sm text-accent">{p.brand}</p>
        <Link href={`/product/${p.slug}`} className="mt-1 text-base font-medium text-primary hover:text-accent">{p.name}</Link>
        <div className="mt-1.5"><Rating value={p.rating} count={p.reviews} /></div>
        <p className="mt-2 hidden text-sm sm:block">{p.size} · {p.finish} finish{p.vegan ? ' · vegan' : ''}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <p className="text-primary"><b className="text-lg">{formatPrice(p.price)}</b> {off > 0 && <span className="ml-1 text-xs line-through">{formatPrice(p.mrp)}</span>}</p>
          <div className="flex items-center gap-2">
            <button aria-label="Wishlist" aria-pressed={wished} onClick={() => toggleWishlist(p.id)} className="rounded-full bg-secondary p-2.5 text-primary hover:bg-accent hover:text-white"><Heart size={16} className={cn(wished && 'fill-highlight text-highlight')} /></button>
            <button aria-label="Quick view" onClick={() => onQuickView?.(p)} className="rounded-full bg-secondary p-2.5 text-primary hover:bg-accent hover:text-white"><Eye size={16} /></button>
            <button disabled={p.stock === 0} onClick={() => { addToCart({ id: p.id, slug: p.slug, name: p.name, price: p.price }); toast.success('Added to your bag'); }} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm text-white hover:bg-accent disabled:opacity-50"><ShoppingBag size={16} /> {p.stock === 0 ? 'Sold out' : 'Add'}</button>
          </div>
        </div>
      </div>
    </article>
  );
}
