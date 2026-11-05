'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import OrderTimeline, { statusTone } from '@/components/order/OrderTimeline';
import { formatPrice, cn } from '@/lib/utils';

export default function TrackOrder() {
  const [f, setF] = useState({ number: '', email: '' });
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);
  const input = 'h-12 w-full rounded-xl bg-background px-4 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent';

  const go = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      const r = await fetch('/api/orders/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Could not find that order');
      setOrder(j.order);
    } catch (err) { setOrder(null); toast.error(err.message); } finally { setBusy(false); }
  };
  return (
    <div className="container-x max-w-3xl py-12">
      <h1 className="text-3xl sm:text-4xl">Track your order</h1>
      <p className="mt-2">Enter the order number from your confirmation email and the email you used.</p>
      <form onSubmit={go} className="mt-6 grid gap-3 rounded-2xl bg-white p-6 shadow-soft sm:grid-cols-[1fr_1fr_auto]">
        <input required placeholder="Order number, e.g. LUM-261008-A1B2C3" aria-label="Order number" value={f.number} onChange={(e) => setF({ ...f, number: e.target.value })} className={input} />
        <input required type="email" placeholder="Email" aria-label="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={input} />
        <Button type="submit" size="lg" disabled={busy}>{busy ? 'Checking…' : 'Track'}</Button>
      </form>
      {order && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="label-sm text-accent">Order</p><p className="font-serif text-2xl text-primary">{order.number}</p></div><span className={cn('rounded-full px-3 py-1 text-xs font-semibold uppercase', statusTone[order.status])}>{order.status}</span></div>
          <div className="mt-6"><OrderTimeline status={order.status} tracking={order.tracking} courier={order.courier} awb={order.awb} /></div>
          <ul className="mt-6 divide-y divide-secondary border-t border-secondary text-sm">{order.items.map((i, k) => <li key={k} className="flex justify-between py-2"><span>{i.name} x {i.qty}</span></li>)}</ul>
          <p className="mt-3 text-sm">Total: <b className="text-primary">{formatPrice(order.total)}</b> · Delivering to {order.city}</p>
        </div>
      )}
    </div>
  );
}
