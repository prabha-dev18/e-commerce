'use client';
import Link from 'next/link';
import { GitCompareArrows, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Rating from '@/components/ui/Rating';
import Button from '@/components/ui/Button';
import ProductVisual from '@/components/product/ProductVisual';
import { useStore } from '@/store/useStore';
import useHydrated from '@/hooks/useHydrated';
import { facets } from '@/lib/catalog';
import useProductsByIds from '@/hooks/useProductsByIds';
import { formatPrice } from '@/lib/utils';

const yes = (v) => (v ? 'Yes' : 'No');
const rows = [
  ['Brand', (p) => p.brand], ['Price', (p) => formatPrice(p.price)], ['Rating', (p) => <Rating value={p.rating} count={p.reviews} />],
  ['Category', (p) => facets.category.find(([v]) => v === p.category)?.[1]], ['Size', (p) => p.size], ['Finish', (p) => p.finish],
  ['Skin type', (p) => p.skin.join(', ')], ['Vegan', (p) => yes(p.vegan)], ['Cruelty-free', (p) => yes(p.cf)], ['Paraben-free', (p) => yes(p.pf)],
  ['Availability', (p) => (p.stock > 0 ? 'In stock' : 'Out of stock')],
];

export default function ComparePage() {
  const ready = useHydrated();
  const compare = useStore((s) => s.compare);
  const { toggleCompare, addToCart } = useStore();
  const { items: loaded, loading } = useProductsByIds(ready ? compare : []);
  const items = ready ? loaded : [];

  if (ready && !loading && items.length === 0) return (
    <div className="container-x flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <GitCompareArrows size={40} className="text-accent" /><h1 className="text-3xl">Nothing to compare yet</h1>
      <p className="text-sm">Pick up to 4 products using the compare icon on any product.</p><Button href="/shop">Browse products</Button>
    </div>
  );
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl sm:text-4xl">Compare products</h1>
      <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr>
              <th className="w-36 p-4" />
              {items.map((p) => (
                <th key={p.id} className="relative p-4 align-top font-normal">
                  <button aria-label={`Remove ${p.name}`} onClick={() => toggleCompare(p.id)} className="absolute right-2 top-2 rounded-full p-1.5 hover:bg-secondary"><X size={16} /></button>
                  <Link href={`/product/${p.slug}`} className="block"><div className="mb-3 aspect-square w-full max-w-[180px] overflow-hidden rounded-xl"><ProductVisual src={p.image} alt={p.name} tone={p.tone} /></div>
                    <span className="font-medium text-primary hover:text-accent">{p.name}</span></Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, fn]) => (
              <tr key={label} className="border-t border-secondary">
                <th scope="row" className="p-4 font-medium text-primary">{label}</th>
                {items.map((p) => <td key={p.id} className="p-4 capitalize">{fn(p)}</td>)}
              </tr>
            ))}
            <tr className="border-t border-secondary">
              <td />
              {items.map((p) => <td key={p.id} className="p-4"><Button size="sm" disabled={p.stock === 0} onClick={() => { addToCart({ id: p.id, slug: p.slug, name: p.name, price: p.price }); toast.success('Added to your bag'); }}>Add to bag</Button></td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
