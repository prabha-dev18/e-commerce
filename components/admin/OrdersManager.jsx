'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import OrderTimeline, { statusTone } from '@/components/order/OrderTimeline';
import { api, useList, PageHead, Pager, Table, Pill, SearchBox, Field, inputCls, money, dt, card } from './ui';

const STATUSES = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'];

function Detail({ id, onClose, onChanged }) {
  const [o, setO] = useState(null);
  const [f, setF] = useState({ status: '', courier: '', awb: '', note: '' });
  const [busy, setBusy] = useState(false);
  const load = () => api(`/api/admin/orders/${id}`).then(({ order }) => { setO(order); setF({ status: order.status, courier: order.courier || '', awb: order.awb || '', note: '' }); }).catch((e) => toast.error(e.message));
  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async () => {
    setBusy(true);
    try { await api(`/api/admin/orders/${id}`, { method: 'PATCH', body: { status: f.status !== o.status ? f.status : undefined, courier: f.courier, awb: f.awb, note: f.note || undefined } }); toast.success('Order updated'); await load(); onChanged(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  const confirmPay = async () => {
    if (!confirm('Confirm that the money has reached your bank or UPI account?')) return;
    try { await api(`/api/admin/orders/${id}`, { method: 'PATCH', body: { confirmPayment: true } }); toast.success('Payment confirmed'); await load(); onChanged(); } catch (e) { toast.error(e.message); }
  };
  const refund = async () => {
    if (!confirm(`Refund ${money(o.total)} to the customer?`)) return;
    try { await api(`/api/admin/orders/${id}/refund`, { method: 'POST', body: {} }); toast.success('Refund started'); await load(); onChanged(); } catch (e) { toast.error(e.message); }
  };
  if (!o) return <p className="p-6">Loading…</p>;
  const closed = ['cancelled', 'returned'].includes(o.status);
  return (
    <div className="space-y-6 p-5 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-serif text-2xl text-primary">{o.number}</p><p>{dt(o.createdAt)}</p></div><Pill tone={statusTone[o.status]}>{o.status}</Pill></div>
      <section><h3 className="mb-2 font-medium text-primary">Customer</h3><p>{o.address.name} · {o.address.phone}<br />{o.user ? `${o.user.name} (${o.user.email})` : `Guest: ${o.guestEmail}`}<br />{o.address.line1} {o.address.line2}, {o.address.city}, {o.address.state} {o.address.pincode}{o.gstin && <><br />GSTIN: {o.gstin}</>}</p></section>
      <section><h3 className="mb-2 font-medium text-primary">Items</h3><ul className="divide-y divide-secondary">{o.items.map((i, k) => <li key={k} className="flex justify-between gap-3 py-2"><span>{i.name}{i.variant && ` (${i.variant})`} x {i.qty}</span><span>{money(i.price * i.qty)}</span></li>)}</ul>
        <dl className="mt-3 space-y-1"><div className="flex justify-between"><dt>Subtotal</dt><dd>{money(o.subtotal)}</dd></div>{o.coupon?.discount > 0 && <div className="flex justify-between"><dt>Discount ({o.coupon.code})</dt><dd>-{money(o.coupon.discount)}</dd></div>}<div className="flex justify-between"><dt>Shipping ({o.shippingMethod})</dt><dd>{o.shipping ? money(o.shipping) : 'Free'}</dd></div><div className="flex justify-between font-medium text-primary"><dt>Total</dt><dd>{money(o.total)}</dd></div></dl></section>
      <section className={`${card} p-4`}><h3 className="mb-1 font-medium text-primary">Payment</h3><p>{o.payment.method === 'cod' ? 'Cash on delivery' : o.payment.method === 'upi' ? 'UPI QR code' : 'Razorpay'} · <b className="capitalize">{o.payment.status}</b>{o.payment.razorpayPaymentId && <><br />Payment ID: {o.payment.razorpayPaymentId}</>}{o.payment.utr && <><br />UPI reference (UTR): <b>{o.payment.utr}</b></>}</p>
        {o.payment.method === 'upi' && o.payment.status === 'pending' && !closed && <Button size="sm" className="mt-3" onClick={confirmPay}>Confirm payment received</Button>}
        {o.payment.status === 'paid' && <Button size="sm" variant="outline" className="mt-3" onClick={refund}>Refund {money(o.total)}</Button>}</section>
      <section><h3 className="mb-3 font-medium text-primary">Update order</h3>
        {closed ? <p>This order is {o.status}, so its status can no longer change.</p> : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Status"><select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className={inputCls}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Courier"><input value={f.courier} onChange={(e) => setF({ ...f, courier: e.target.value })} placeholder="e.g. Delhivery" className={inputCls} /></Field>
            <Field label="Tracking number"><input value={f.awb} onChange={(e) => setF({ ...f, awb: e.target.value })} className={inputCls} /></Field>
            <Field label="Note for the customer (optional)"><input value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} className={inputCls} /></Field>
            <div className="sm:col-span-2"><Button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button> <Button variant="ghost" href={`/api/orders/${id}/invoice`} target="_blank" rel="noopener">Invoice</Button></div>
          </div>)}
        {closed && <Button variant="ghost" className="mt-2" href={`/api/orders/${id}/invoice`} target="_blank" rel="noopener">Invoice</Button>}
      </section>
      <section><h3 className="mb-3 font-medium text-primary">Timeline</h3><OrderTimeline status={o.status} tracking={o.tracking} courier={o.courier} awb={o.awb} /></section>
    </div>
  );
}

export default function OrdersManager() {
  const [q, setQ] = useState(''); const [status, setStatus] = useState(''); const [payment, setPayment] = useState(''); const [page, setPage] = useState(1); const [open, setOpen] = useState(null);
  const { data, err, reload } = useList('/api/admin/orders', { q, status, payment, page });
  return (
    <div>
      <PageHead title="Orders" sub="Click an order to update its status, add tracking or refund it.">
        <SearchBox value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Order no, name, phone, email" />
        <select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={`${inputCls} w-36`}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select aria-label="Payment" value={payment} onChange={(e) => { setPayment(e.target.value); setPage(1); }} className={`${inputCls} w-36`}><option value="">All payments</option>{['pending', 'paid', 'failed', 'refunded'].map((s) => <option key={s}>{s}</option>)}</select>
      </PageHead>
      {err && <p className="mb-4 rounded-xl bg-highlight/10 p-3 text-sm text-highlight" role="alert">{err}</p>}
      <Table rows={data?.items} onRow={(r) => setOpen(r._id)} empty="No orders match." cols={[
        { label: 'Order', render: (r) => <b className="text-primary">{r.number}</b> }, { label: 'Customer', render: (r) => r.address?.name }, { label: 'Date', render: (r) => dt(r.createdAt) },
        { label: 'Total', render: (r) => money(r.total) }, { label: 'Payment', render: (r) => <span className="capitalize">{r.payment.method === 'cod' ? 'COD' : 'Online'} · {r.payment.status}</span> }, { label: 'Status', render: (r) => <Pill tone={statusTone[r.status]}>{r.status}</Pill> },
      ]} />
      <Pager page={page} pages={data?.pages} onPage={setPage} />
      <Drawer open={!!open} onClose={() => setOpen(null)} title="Order" width="max-w-xl">{open && <Detail id={open} onClose={() => setOpen(null)} onChanged={reload} />}</Drawer>
    </div>
  );
}
