'use client';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Rating from '@/components/ui/Rating';
import ProductVisual from './ProductVisual';
import { useStore } from '@/store/useStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function QuickView({ product: p, onClose }) {
  const addToCart = useStore((s) => s.addToCart);
  return (
    <Modal open={!!p} onClose={onClose} title={p?.name}>
      {p && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-xl"><ProductVisual src={p.image} alt={p.name} tone={p.tone} /></div>
          <div className="flex flex-col">
            <p className="label-sm text-accent">{p.brand}</p>
            <div className="mt-2"><Rating value={p.rating} count={p.reviews} /></div>
            <p className="mt-4 text-2xl text-primary">{formatPrice(p.price)} <span className="ml-2 text-sm text-body line-through">{formatPrice(p.mrp)}</span></p>
            <p className="mt-4 text-sm leading-relaxed">Dermatologically tested and made without parabens. Full ingredients and usage steps are on the product page.</p>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <Button onClick={() => { addToCart({ id: p.id, name: p.name, price: p.price }); toast.success('Added to your bag'); onClose(); }}>Add to bag</Button>
              <Button href={`/product/${p.slug}`} variant="outline" onClick={onClose}>View details</Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
