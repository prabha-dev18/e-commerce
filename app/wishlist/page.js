'use client';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '@/components/product/ProductCard';
import QuickView from '@/components/product/QuickView';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import useHydrated from '@/hooks/useHydrated';
import useProductsByIds from '@/hooks/useProductsByIds';

export default function WishlistPage() {
  const ready = useHydrated();
  const wishlist = useStore((s) => s.wishlist);
  const { addToCart, clearWishlist } = useStore();
  const [qv, setQv] = useState(null);
  const { items: loaded, loading } = useProductsByIds(ready ? wishlist : []);
  const items = ready ? loaded : [];

  const moveAll = () => {
    items.filter((p) => p.stock > 0).forEach((p) => addToCart({ id: p.id, slug: p.slug, name: p.name, price: p.price }));
    clearWishlist();
    toast.success('Moved to your bag');
  };
  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl">Wishlist{items.length ? ` (${items.length})` : ''}</h1>
        {items.length > 0 && <div className="flex gap-3"><Button onClick={moveAll}>Move all to bag</Button><Button variant="outline" onClick={clearWishlist}>Clear</Button></div>}
      </div>
      {ready && !loading && items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-white py-20 text-center shadow-soft">
          <Heart size={40} className="text-accent" /><h2 className="text-xl">Your wishlist is empty</h2>
          <p className="text-sm">Tap the heart on any product to save it here.</p><Button href="/shop">Browse products</Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQv} />)}</div>
      )}
      <QuickView product={qv} onClose={() => setQv(null)} />
    </div>
  );
}
