'use client';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import useHydrated from '@/hooks/useHydrated';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/utils';

export default function CartDrawer() {
  const ready = useHydrated();
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart } = useStore();
  const items = ready ? cart : [];
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);
  const left = Math.max(FREE_SHIPPING_THRESHOLD - total, 0);
  const pct = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const close = () => setCartOpen(false);

  const footer = items.length > 0 && (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-primary"><span>Subtotal</span><span className="font-serif text-xl">{formatPrice(total)}</span></div>
      <p className="text-xs">Taxes and shipping are calculated at checkout.</p>
      <Button href="/checkout" onClick={close} className="w-full" size="lg">Checkout</Button>
      <Button href="/cart" onClick={close} variant="outline" className="w-full">View cart</Button>
    </div>
  );

  return (
    <Drawer open={cartOpen} onClose={close} title={`Your bag${items.length ? ` (${items.length})` : ''}`} footer={footer}>
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <ShoppingBag size={44} className="text-accent" />
          <h3 className="text-xl">Your bag is empty</h3>
          <p className="text-sm">Add a product to see it here.</p>
          <Button href="/shop" onClick={close}>Start shopping</Button>
        </div>
      ) : (
        <>
          <div className="border-b border-secondary bg-background px-5 py-4">
            <p className="mb-2 flex items-center gap-2 text-sm text-primary">
              <Truck size={16} className="text-accent" />
              {left > 0 ? <>Add <b>{formatPrice(left)}</b> more for free shipping</> : <>You've unlocked free shipping</>}
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <motion.div className="h-full bg-accent" initial={false} animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
            </div>
          </div>
          <ul className="divide-y divide-secondary">
            {items.map((i) => (
              <li key={i.key} className="flex gap-4 p-5">
                <div className="h-20 w-20 shrink-0 rounded-xl bg-secondary" />
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${i.slug || i.id}`} onClick={close} className="line-clamp-2 text-sm font-medium text-primary">{i.name}</Link>
                  {i.variant && <p className="text-xs">{i.variant}</p>}
                  <p className="mt-1 text-sm text-primary">{formatPrice(i.price)}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-secondary">
                      <button aria-label="Decrease" onClick={() => setQty(i.key, i.qty - 1)} className="p-2"><Minus size={14} /></button>
                      <span className="w-6 text-center text-sm text-primary">{i.qty}</span>
                      <button aria-label="Increase" onClick={() => setQty(i.key, i.qty + 1)} className="p-2"><Plus size={14} /></button>
                    </div>
                    <button aria-label={`Remove ${i.name}`} onClick={() => removeFromCart(i.key)} className="p-2 text-body hover:text-highlight"><Trash2 size={16} /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Drawer>
  );
}
