'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, Tag, X, ShoppingBag, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import ProductVisual from '@/components/product/ProductVisual';
import { ProductStrip } from '@/components/product/ProductExtras';
import { useStore } from '@/store/useStore';
import useHydrated from '@/hooks/useHydrated';
import { catalog } from '@/lib/catalog';
import { formatPrice, FREE_SHIPPING_THRESHOLD, shippingFor } from '@/lib/utils';

export default function CartPage() {
  const ready = useHydrated();
  const { cart, coupon, setCoupon, setQty, removeFromCart } = useStore();
  const items = ready ? cart : [];
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
  const discount = coupon && subtotal ? Math.min(coupon.discount, subtotal) : 0;
  const shipping = shippingFor(subtotal - discount);
  const total = subtotal - discount + shipping;
  const lines = useMemo(() => items.map((i) => ({ id: i.id, qty: i.qty, price: i.price })), [items]);
  const upsell = useMemo(() => catalog.filter((p) => !items.some((i) => i.id === p.id) && p.stock > 0).slice(0, 8), [items]);

  const validate = async (c) => {
    const r = await fetch('/api/coupons/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: c, items: lines }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Could not check this code');
    return j;
  };
  const apply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    try { const j = await validate(code.trim().toUpperCase()); setCoupon({ code: j.code, discount: j.discount }); toast.success(j.message); setCode(''); }
    catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };
  // Keep the discount correct when quantities change; drop the code if it no longer qualifies.
  useEffect(() => {
    if (!ready || !coupon || lines.length === 0) return;
    let off = false;
    validate(coupon.code).then((j) => !off && j.discount !== coupon.discount && setCoupon({ code: j.code, discount: j.discount }))
      .catch((err) => { if (!off) { setCoupon(null); toast.error(`${coupon.code} removed: ${err.message}`); } });
    return () => { off = true; };
  }, [subtotal, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  if (ready && items.length === 0) return (
    <div className="container-x flex min-h-[55vh] flex-col items-center justify-center gap-3 text-center">
      <ShoppingBag size={44} className="text-accent" /><h1 className="text-3xl">Your bag is empty</h1><p className="text-sm">Add a few favourites and they will show up here.</p><Button href="/shop">Start shopping</Button>
    </div>
  );
  const left = Math.max(FREE_SHIPPING_THRESHOLD - (subtotal - discount), 0);
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl sm:text-4xl">Your bag</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-soft">
            <p className="flex items-center gap-2 text-sm text-primary"><Truck size={16} className="text-accent" />{left > 0 ? <>Add <b>{formatPrice(left)}</b> more for free shipping</> : 'You have unlocked free shipping'}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-accent transition-all duration-500" style={{ width: `${Math.min(((subtotal - discount) / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }} /></div>
          </div>
          <ul className="divide-y divide-secondary rounded-2xl bg-white shadow-soft">
            {items.map((i) => (
              <li key={i.key} className="flex gap-4 p-4 sm:p-5">
                <Link href={`/product/${i.slug || i.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl"><ProductVisual src={catalog.find((p) => p.id === i.id)?.image} alt={i.name} /></Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${i.slug || i.id}`} className="font-medium text-primary hover:text-accent">{i.name}</Link>
                  {i.variant && <p className="text-xs">{i.variant}</p>}
                  <p className="mt-1 text-sm text-primary">{formatPrice(i.price)}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-secondary">
                      <button aria-label="Decrease" onClick={() => setQty(i.key, i.qty - 1)} className="p-2.5"><Minus size={14} /></button>
                      <span className="w-7 text-center text-sm text-primary">{i.qty}</span>
                      <button aria-label="Increase" onClick={() => setQty(i.key, Math.min(10, i.qty + 1))} className="p-2.5"><Plus size={14} /></button>
                    </div>
                    <p className="font-medium text-primary">{formatPrice(i.price * i.qty)}</p>
                    <button aria-label={`Remove ${i.name}`} onClick={() => removeFromCart(i.key)} className="p-2 text-body hover:text-highlight"><Trash2 size={17} /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-soft lg:sticky lg:top-32">
          <h2 className="text-xl">Order summary</h2>
          {coupon ? (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary px-4 py-3 text-sm text-primary">
              <span className="flex items-center gap-2"><Tag size={15} className="text-accent" /><b>{coupon.code}</b> applied</span>
              <button aria-label="Remove coupon" onClick={() => setCoupon(null)}><X size={16} /></button>
            </div>
          ) : (
            <form onSubmit={apply} className="mt-4 flex gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Coupon code" aria-label="Coupon code" className="h-11 flex-1 rounded-full bg-background px-4 text-sm uppercase text-primary outline-none ring-1 ring-secondary focus:ring-accent" />
              <Button type="submit" variant="soft" disabled={busy}>{busy ? '…' : 'Apply'}</Button>
            </form>
          )}
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="text-primary">{formatPrice(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between"><dt>Discount</dt><dd className="text-[#4d7a52]">-{formatPrice(discount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd className="text-primary">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between border-t border-secondary pt-3 text-base"><dt className="font-medium text-primary">Total</dt><dd className="font-serif text-2xl text-primary">{formatPrice(total)}</dd></div>
          </dl>
          <p className="mt-1 text-xs">Taxes included. Final amount is confirmed at checkout.</p>
          <Button href="/checkout" size="lg" className="mt-5 w-full">Proceed to checkout</Button>
          <Link href="/shop" className="mt-3 block text-center text-sm underline">Continue shopping</Link>
        </aside>
      </div>
      <div className="mt-16"><ProductStrip title="Add something extra" products={upsell} /></div>
    </div>
  );
}
