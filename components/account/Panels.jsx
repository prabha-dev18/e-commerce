'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Copy, Trash2, Pencil, Plus, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import AddressFields from '@/components/AddressFields';
import ProductVisual from '@/components/product/ProductVisual';
import OrderTimeline, { statusTone } from '@/components/order/OrderTimeline';
import { addressSchema, passwordChangeSchema } from '@/lib/validations';
import { payOnline } from '@/lib/payOnline';
import UpiQrModal from '@/components/checkout/UpiQrModal';
import { formatPrice, cn } from '@/lib/utils';

const json = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const date = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const box = 'rounded-2xl bg-white p-6 shadow-soft';
const input = 'h-12 w-full rounded-xl bg-background px-4 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent';
const Empty = ({ children }) => <div className={`${box} py-12 text-center text-sm`}>{children}</div>;

export function ProfilePanel({ me, setMe }) {
  const [form, setForm] = useState({ name: me.name, phone: me.phone });
  const [saving, setSaving] = useState(false);
  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try { const r = await fetch('/api/me', json('PATCH', form)); const j = await r.json(); if (!r.ok) throw new Error(j.error || 'Could not save'); setMe(j); toast.success('Profile updated'); }
    catch (err) { toast.error(err.message); } finally { setSaving(false); }
  };
  return (
    <form onSubmit={save} className={`${box} max-w-xl space-y-4`}>
      <h2 className="text-xl">Profile</h2>
      <label className="block text-sm font-medium text-primary">Full name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${input} mt-1.5`} /></label>
      <label className="block text-sm font-medium text-primary">Email<input value={me.email} disabled className={`${input} mt-1.5 opacity-60`} /></label>
      <label className="block text-sm font-medium text-primary">Mobile number<input value={form.phone} inputMode="numeric" onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} className={`${input} mt-1.5`} /></label>
      <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
    </form>
  );
}

function ReturnForm({ order, onDone }) {
  const [sel, setSel] = useState({});
  const [reason, setReason] = useState('');
  const [type, setType] = useState('return');
  const submit = async (e) => {
    e.preventDefault();
    const items = order.items.filter((i) => sel[i.productId]).map((i) => ({ productId: i.productId, qty: i.qty }));
    if (!items.length) return toast.error('Choose at least one item');
    try { const r = await fetch(`/api/orders/${order._id}/return`, json('POST', { items, reason, type })); const j = await r.json(); if (!r.ok) throw new Error(j.error); toast.success(j.message); onDone(); } catch (err) { toast.error(err.message || 'Could not send the request'); }
  };
  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-xl bg-background p-4 text-sm">
      <p className="font-medium text-primary">Which items?</p>
      {order.items.map((i) => <label key={i.productId} className="flex items-center gap-2"><input type="checkbox" checked={!!sel[i.productId]} onChange={(e) => setSel({ ...sel, [i.productId]: e.target.checked })} className="accent-[#2A211D]" />{i.name} x {i.qty}</label>)}
      <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Request type" className="h-10 rounded-full bg-secondary px-3 text-primary outline-none"><option value="return">Return</option><option value="refund">Refund</option><option value="exchange">Exchange</option></select>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} placeholder="Tell us what went wrong" aria-label="Reason" className="w-full rounded-xl bg-white p-3 text-primary outline-none ring-1 ring-secondary focus:ring-accent" />
      <Button type="submit" size="sm">Send request</Button>
    </form>
  );
}

export function OrdersPanel({ me }) {
  const [orders, setOrders] = useState(null);
  const [open, setOpen] = useState(null);
  const [returning, setReturning] = useState(null);
  const [qrFor, setQrFor] = useState(null);
  const load = useCallback(() => fetch('/api/orders').then((r) => r.json()).then((j) => setOrders(j.orders || [])).catch(() => setOrders([])), []);
  useEffect(() => { load(); }, [load]);

  const cancel = async (o) => {
    if (!confirm(`Cancel order ${o.number}?`)) return;
    try { const r = await fetch(`/api/orders/${o._id}/cancel`, json('POST', {})); const j = await r.json(); if (!r.ok) throw new Error(j.error); toast.success('Order cancelled'); load(); } catch (e) { toast.error(e.message); }
  };
  const payNow = async (o) => {
    try {
      const r = await fetch(`/api/orders/${o._id}/pay`, json('POST', {})); const j = await r.json(); if (!r.ok) throw new Error(j.error);
      await payOnline({ order: j, prefill: { name: o.address.name, email: me.email, contact: o.address.phone }, onPaid: () => { toast.success('Payment received'); load(); } });
    } catch (e) { toast.error(e.message); }
  };

  if (!orders) return <Empty>Loading your orders…</Empty>;
  if (!orders.length) return <Empty>No orders yet. <Link href="/shop" className="underline">Start shopping</Link></Empty>;
  return (
    <>
    <ul className="space-y-4">
      {orders.map((o) => {
        const isOpen = open === o._id;
        const deliveredAt = [...o.tracking].reverse().find((t) => t.status === 'delivered')?.at;
        const canReturn = o.status === 'delivered' && deliveredAt && Date.now() - new Date(deliveredAt) < 7 * 864e5;
        return (
          <li key={o._id} className={box}>
            <button onClick={() => setOpen(isOpen ? null : o._id)} aria-expanded={isOpen} className="flex w-full flex-wrap items-center justify-between gap-3 text-left">
              <div><p className="font-medium text-primary">{o.number}</p><p className="text-xs">{date(o.createdAt)} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</p></div>
              <div className="flex items-center gap-4"><span className={cn('rounded-full px-3 py-1 text-xs font-semibold uppercase', statusTone[o.status])}>{o.status}</span><span className="font-serif text-lg text-primary">{formatPrice(o.total)}</span><ChevronDown size={18} className={cn('transition-transform', isOpen && 'rotate-180')} /></div>
            </button>
            {isOpen && (
              <div className="mt-5 border-t border-secondary pt-5">
                <ul className="space-y-3">{o.items.map((i, k) => <li key={k} className="flex items-center gap-3 text-sm"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg"><ProductVisual src={i.image} alt={i.name} /></div><div className="flex-1"><Link href={`/product/${i.slug}`} className="text-primary hover:text-accent">{i.name}</Link><p className="text-xs">{i.variant ? `${i.variant} · ` : ''}Qty {i.qty}</p></div><span>{formatPrice(i.price * i.qty)}</span></li>)}</ul>
                <div className="mt-6"><OrderTimeline status={o.status} tracking={o.tracking} courier={o.courier} awb={o.awb} /></div>
                <p className="mt-5 text-sm">Delivering to {o.address.name}, {o.address.line1}, {o.address.city} {o.address.pincode}<br />Payment: {o.payment.method === 'cod' ? 'Cash on delivery' : o.payment.method === 'upi' ? 'UPI QR code' : 'Online'} ({o.payment.status})</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button size="sm" variant="soft" href={`/api/orders/${o._id}/invoice`} target="_blank" rel="noopener">Invoice</Button>
                  {o.payment.method === 'razorpay' && o.payment.status === 'pending' && o.status === 'placed' && <Button size="sm" onClick={() => payNow(o)}>Pay now</Button>}
                  {o.payment.method === 'upi' && o.payment.status === 'pending' && o.status === 'placed' && <Button size="sm" onClick={() => setQrFor({ id: o._id, t: o.t || '', number: o.number, total: o.total })}>Pay with QR</Button>}
                  {['placed', 'confirmed'].includes(o.status) && <Button size="sm" variant="outline" onClick={() => cancel(o)}>Cancel order</Button>}
                  {canReturn && <Button size="sm" variant="outline" onClick={() => setReturning(returning === o._id ? null : o._id)}>Return or refund</Button>}
                  {o.status === 'delivered' && <Button size="sm" variant="ghost" href={`/product/${o.items[0].slug}#tabs`}>Write a review</Button>}
                </div>
                {returning === o._id && <ReturnForm order={o} onDone={() => setReturning(null)} />}
              </div>
            )}
          </li>
        );
      })}
    </ul>
    <UpiQrModal open={!!qrFor} order={qrFor} onClose={() => setQrFor(null)} onPaid={() => { setQrFor(null); load(); }} onClaimed={() => { setQrFor(null); load(); }} />
    </>
  );
}

export function AddressesPanel() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | address
  const load = useCallback(() => fetch('/api/addresses').then((r) => r.json()).then((j) => setItems(j.items || [])).catch(() => setItems([])), []);
  useEffect(() => { load(); }, [load]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(addressSchema.omit({ label: true, isDefault: true })) });
  useEffect(() => { if (editing) reset(editing === 'new' ? { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' } : editing); }, [editing, reset]);

  const save = async (v) => {
    try {
      const isNew = editing === 'new';
      const r = await fetch(isNew ? '/api/addresses' : `/api/addresses/${editing.id}`, json(isNew ? 'POST' : 'PUT', { ...v, label: isNew ? 'Home' : editing.label, isDefault: isNew ? false : editing.isDefault }));
      const j = await r.json(); if (!r.ok) throw new Error(j.error);
      toast.success('Address saved'); setEditing(null); load();
    } catch (e) { toast.error(e.message); }
  };
  const del = async (a) => { if (!confirm('Delete this address?')) return; await fetch(`/api/addresses/${a.id}`, { method: 'DELETE' }); load(); };
  const makeDefault = async (a) => { await fetch(`/api/addresses/${a.id}`, json('PUT', { ...a, isDefault: true })); load(); };

  if (!items) return <Empty>Loading…</Empty>;
  return (
    <div className="space-y-4">
      {editing ? (
        <form onSubmit={handleSubmit(save)} noValidate className={box}>
          <h2 className="mb-4 text-xl">{editing === 'new' ? 'New address' : 'Edit address'}</h2>
          <AddressFields register={register} errors={errors} />
          <div className="mt-5 flex gap-3"><Button type="submit" disabled={isSubmitting}>Save address</Button><Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </form>
      ) : (
        <>
          <Button variant="soft" onClick={() => setEditing('new')}><Plus size={16} /> Add address</Button>
          {items.length === 0 ? <Empty>No saved addresses yet.</Empty> : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {items.map((a) => (
                <li key={a.id} className={box}>
                  <p className="flex items-center gap-2 font-medium text-primary">{a.name}{a.isDefault && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] uppercase text-white">Default</span>}</p>
                  <p className="mt-2 text-sm">{a.line1} {a.line2}<br />{a.city}, {a.state} {a.pincode}<br />{a.phone}</p>
                  <div className="mt-4 flex gap-2">
                    <button aria-label="Edit address" onClick={() => setEditing(a)} className="rounded-full bg-secondary p-2.5 hover:bg-accent hover:text-white"><Pencil size={15} /></button>
                    <button aria-label="Delete address" onClick={() => del(a)} className="rounded-full bg-secondary p-2.5 hover:bg-highlight hover:text-white"><Trash2 size={15} /></button>
                    {!a.isDefault && <button onClick={() => makeDefault(a)} className="ml-auto text-xs underline">Make default</button>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export function ReviewsPanel() {
  const [items, setItems] = useState(null);
  useEffect(() => { fetch('/api/reviews/mine').then((r) => r.json()).then((j) => setItems(j.items || [])).catch(() => setItems([])); }, []);
  if (!items) return <Empty>Loading…</Empty>;
  if (!items.length) return <Empty>You have not written any reviews yet. You can review products from delivered orders.</Empty>;
  return <ul className="space-y-4">{items.map((r) => <li key={r.id} className={box}><div className="flex items-center justify-between"><p className="font-medium text-primary">{r.product ? <Link href={`/product/${r.product.slug}`} className="hover:text-accent">{r.product.name}</Link> : 'Product'}</p><span className="text-xs capitalize">{r.status}</span></div><p className="mt-1 text-accent">{'★'.repeat(r.rating)}<span className="text-secondary">{'★'.repeat(5 - r.rating)}</span></p><p className="mt-2 text-sm">{r.text}</p><p className="mt-2 text-xs">{date(r.at)}</p></li>)}</ul>;
}

export function NotificationsPanel({ onRead }) {
  const [items, setItems] = useState(null);
  useEffect(() => { fetch('/api/notifications').then((r) => r.json()).then((j) => { setItems(j.items || []); if (j.unread) fetch('/api/notifications', { method: 'PATCH' }).then(() => onRead?.()); }).catch(() => setItems([])); }, [onRead]);
  if (!items) return <Empty>Loading…</Empty>;
  if (!items.length) return <Empty><Bell className="mx-auto mb-2 text-accent" /> No notifications yet.</Empty>;
  return <ul className="space-y-3">{items.map((n) => <li key={n.id} className={cn(box, 'py-4', !n.read && 'ring-1 ring-accent')}><p className="font-medium text-primary">{n.title}</p><p className="text-sm">{n.body}</p><p className="mt-1 text-xs">{date(n.at)}{n.href && <> · <Link href={n.href} className="underline">View</Link></>}</p></li>)}</ul>;
}

export function PasswordPanel() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(passwordChangeSchema) });
  const onSubmit = async (v) => {
    try { const r = await fetch('/api/me/password', json('POST', v)); const j = await r.json(); if (!r.ok) throw new Error(j.error); toast.success(j.message); reset(); } catch (e) { toast.error(e.message); }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={`${box} max-w-md space-y-4`}>
      <h2 className="text-xl">Change password</h2>
      {[['current', 'Current password', 'current-password'], ['password', 'New password', 'new-password']].map(([f, l, a]) => (
        <div key={f}><label htmlFor={`p-${f}`} className="mb-1.5 block text-sm font-medium text-primary">{l}</label><input id={`p-${f}`} type="password" autoComplete={a} {...register(f)} className={input} />{errors[f] && <p className="mt-1 text-xs text-highlight" role="alert">{errors[f].message}</p>}</div>
      ))}
      <Button type="submit" disabled={isSubmitting}>Update password</Button>
    </form>
  );
}

export function WalletPanel({ me }) {
  const copy = () => { navigator.clipboard?.writeText(me.referralCode || ''); toast.success('Code copied'); };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={box}><p className="label-sm text-accent">Lumière Circle points</p><p className="mt-2 font-serif text-5xl text-primary">{me.points}</p><p className="mt-2 text-sm">Points are added after your order is delivered and can be used for discounts on future orders.</p></div>
      <div className={box}><p className="label-sm text-accent">Refer & earn</p><p className="mt-2 flex items-center gap-3 font-mono text-xl text-primary">{me.referralCode || 'Not available'}{me.referralCode && <button aria-label="Copy code" onClick={copy} className="rounded-full p-2 hover:bg-secondary"><Copy size={16} /></button>}</p><p className="mt-2 text-sm">Share this code with friends. Rewards for referrals are switched on soon.</p></div>
      <div className={`${box} md:col-span-2`}><p className="label-sm text-accent">Payment methods</p><p className="mt-2 text-sm">We do not store card or UPI details. You choose a payment method each time at checkout, and Razorpay handles it securely.</p></div>
    </div>
  );
}
