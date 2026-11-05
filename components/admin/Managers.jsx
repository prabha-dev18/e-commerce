'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Check as CheckIcon, X, Trash2, Download } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import { statusTone } from '@/components/order/OrderTimeline';
import { api, useList, PageHead, Pager, Table, Pill, SearchBox, Field, Check, inputCls, card, money, dt } from './ui';

export function CustomersManager() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const [q, setQ] = useState(''); const [staff, setStaff] = useState(false); const [page, setPage] = useState(1); const [open, setOpen] = useState(null);
  const { data, err, reload } = useList('/api/admin/customers', { q, staff: staff ? '1' : '', page });
  return (
    <div>
      <PageHead title="Customers" sub={isAdmin ? 'Admins can change roles and block accounts.' : 'View only.'}>
        <SearchBox value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Name, email, phone" />
        <Check label="Staff only" checked={staff} onChange={(v) => { setStaff(v); setPage(1); }} />
      </PageHead>
      {err && <p className="mb-4 rounded-xl bg-highlight/10 p-3 text-sm text-highlight" role="alert">{err}</p>}
      <Table rows={data?.items} onRow={(r) => setOpen(r.id)} empty="No customers found." cols={[
        { label: 'Name', render: (r) => <span><b className="text-primary">{r.name}</b>{r.blocked && <Pill tone="bg-highlight text-white"> blocked</Pill>}<br /><span className="text-xs">{r.email}</span></span> },
        { label: 'Role', render: (r) => <span className="capitalize">{r.role}</span> }, { label: 'Orders', render: (r) => r.orders }, { label: 'Spent', render: (r) => money(r.spent) }, { label: 'Points', render: (r) => r.points }, { label: 'Joined', render: (r) => dt(r.createdAt) },
      ]} />
      <Pager page={page} pages={data?.pages} onPage={setPage} />
      <Drawer open={!!open} onClose={() => setOpen(null)} title="Customer" width="max-w-lg">{open && <CustomerDetail id={open} isAdmin={isAdmin} myId={session?.user?.id} onChanged={reload} />}</Drawer>
    </div>
  );
}
function CustomerDetail({ id, isAdmin, myId, onChanged }) {
  const [d, setD] = useState(null);
  const load = () => api(`/api/admin/customers/${id}`).then(setD).catch((e) => toast.error(e.message));
  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const patch = async (body) => { try { const r = await api(`/api/admin/customers/${id}`, { method: 'PATCH', body }); toast.success(r.note || 'Updated'); load(); onChanged(); } catch (e) { toast.error(e.message); } };
  if (!d) return <p className="p-6">Loading…</p>;
  const u = d.user;
  return (
    <div className="space-y-5 p-5 text-sm">
      <div><p className="font-serif text-2xl text-primary">{u.name}</p><p>{u.email}{u.phone && ` · ${u.phone}`}<br />Joined {dt(u.createdAt)} · {u.provider} · {u.emailVerified ? 'email verified' : 'email not verified'} · {u.points} points</p></div>
      {isAdmin && u._id !== myId && <div className={`${card} space-y-3 p-4`}>
        <Field label="Role"><select value={u.role} onChange={(e) => patch({ role: e.target.value })} className={inputCls}>{['user', 'support', 'manager', 'admin'].map((r) => <option key={r}>{r}</option>)}</select></Field>
        <Button size="sm" variant={u.blocked ? 'soft' : 'outline'} onClick={() => patch({ blocked: !u.blocked })}>{u.blocked ? 'Unblock account' : 'Block account'}</Button>
      </div>}
      <section><h3 className="mb-2 font-medium text-primary">Recent orders</h3>{d.orders.length === 0 ? <p>No orders.</p> : <ul className="divide-y divide-secondary">{d.orders.map((o) => <li key={o._id} className="flex items-center justify-between py-2"><span>{o.number}<br /><span className="text-xs">{dt(o.createdAt)}</span></span><span className="text-right">{money(o.total)}<br /><Pill tone={statusTone[o.status]}>{o.status}</Pill></span></li>)}</ul>}</section>
      <section><h3 className="mb-2 font-medium text-primary">Addresses</h3>{d.addresses.length === 0 ? <p>None saved.</p> : d.addresses.map((a) => <p key={a._id} className="mb-2">{a.name}, {a.line1}, {a.city} {a.pincode}</p>)}</section>
    </div>
  );
}

export function ReviewsManager() {
  const [status, setStatus] = useState('pending'); const [page, setPage] = useState(1);
  const { data, err, reload } = useList('/api/admin/reviews', { status, page });
  const set = async (id, s) => { try { await api(`/api/admin/reviews/${id}`, { method: 'PATCH', body: { status: s } }); toast.success(`Review ${s}`); reload(); } catch (e) { toast.error(e.message); } };
  const del = async (id) => { if (!confirm('Delete this review?')) return; await api(`/api/admin/reviews/${id}`, { method: 'DELETE' }); reload(); };
  return (
    <div>
      <PageHead title="Reviews" sub="Approved reviews appear on the product page and update its rating.">
        <select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={`${inputCls} w-40`}><option value="">All</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select>
      </PageHead>
      {err && <p className="mb-4 rounded-xl bg-highlight/10 p-3 text-sm text-highlight" role="alert">{err}</p>}
      <div className="space-y-3">
        {!data ? <p>Loading…</p> : data.items.length === 0 ? <div className={`${card} p-10 text-center text-sm`}>No reviews here.</div> : data.items.map((r) => (
          <div key={r.id} className={`${card} p-5`}>
            <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium text-primary">{r.product}</p><Pill>{r.status}</Pill></div>
            <p className="mt-1 text-accent">{'★'.repeat(r.rating)}<span className="text-secondary">{'★'.repeat(5 - r.rating)}</span> <span className="text-xs text-body">by {r.name}{r.verified && ' (verified buyer)'} · {dt(r.createdAt)}</span></p>
            <p className="mt-2 text-sm">{r.text}</p>
            <div className="mt-3 flex gap-2">{r.status !== 'approved' && <Button size="sm" onClick={() => set(r.id, 'approved')}><CheckIcon size={14} /> Approve</Button>}{r.status !== 'rejected' && <Button size="sm" variant="outline" onClick={() => set(r.id, 'rejected')}><X size={14} /> Reject</Button>}<Button size="sm" variant="ghost" onClick={() => del(r.id)}><Trash2 size={14} /> Delete</Button></div>
          </div>
        ))}
      </div>
      <Pager page={page} pages={data?.pages} onPage={setPage} />
    </div>
  );
}

const flow = { requested: [['approved', 'Approve'], ['rejected', 'Reject']], approved: [['received', 'Mark received'], ['rejected', 'Reject']], received: [['refunded', 'Refund']], rejected: [], refunded: [] };
export function ReturnsManager() {
  const [status, setStatus] = useState('requested'); const [page, setPage] = useState(1);
  const { data, err, reload } = useList('/api/admin/returns', { status, page });
  const move = async (id, s) => { if (s === 'refunded' && !confirm('This refunds the customer through Razorpay for paid online orders. Continue?')) return; try { await api(`/api/admin/returns/${id}`, { method: 'PATCH', body: { status: s } }); toast.success(`Marked ${s}`); reload(); } catch (e) { toast.error(e.message); } };
  return (
    <div>
      <PageHead title="Returns & refunds" sub="Approve, then mark received (puts items back in stock), then refund.">
        <select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={`${inputCls} w-44`}><option value="">All</option>{['requested', 'approved', 'received', 'refunded', 'rejected'].map((s) => <option key={s}>{s}</option>)}</select>
      </PageHead>
      {err && <p className="mb-4 rounded-xl bg-highlight/10 p-3 text-sm text-highlight" role="alert">{err}</p>}
      <div className="space-y-3">
        {!data ? <p>Loading…</p> : data.items.length === 0 ? <div className={`${card} p-10 text-center text-sm`}>No requests here.</div> : data.items.map((r) => (
          <div key={r.id} className={`${card} p-5 text-sm`}>
            <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium text-primary">{r.orderNumber} · <span className="capitalize">{r.type}</span></p><Pill>{r.status}</Pill></div>
            <p className="mt-1">{r.customer} ({r.email}) · {dt(r.createdAt)} · {r.items.reduce((n, i) => n + i.qty, 0)} item(s)</p>
            <p className="mt-2">“{r.reason}”</p>
            <div className="mt-3 flex gap-2">{flow[r.status].map(([s, l]) => <Button key={s} size="sm" variant={s === 'rejected' ? 'outline' : 'primary'} onClick={() => move(r.id, s)}>{l}</Button>)}</div>
          </div>
        ))}
      </div>
      <Pager page={page} pages={data?.pages} onPage={setPage} />
    </div>
  );
}

export function NewsletterManager() {
  const [page, setPage] = useState(1);
  const { data, err, reload } = useList('/api/admin/newsletter', { page });
  const del = async (id) => { if (!confirm('Remove this subscriber?')) return; await api(`/api/admin/newsletter/${id}`, { method: 'DELETE' }); reload(); };
  return (
    <div>
      <PageHead title="Newsletter" sub={data ? `${data.total} subscribers` : ''}><Button variant="outline" href="/api/admin/newsletter?format=csv"><Download size={16} /> Export CSV</Button></PageHead>
      {err && <p className="mb-4 rounded-xl bg-highlight/10 p-3 text-sm text-highlight" role="alert">{err}</p>}
      <Table rows={data?.items} empty="No subscribers yet." cols={[{ label: 'Email', key: 'email' }, { label: 'Joined', render: (r) => dt(r.createdAt) }, { label: '', right: true, render: (r) => <button aria-label="Remove" onClick={() => del(r.id)} className="rounded-full p-2 hover:bg-highlight hover:text-white"><Trash2 size={15} /></button> }]} />
      <Pager page={page} pages={data?.pages} onPage={setPage} />
    </div>
  );
}

const SECTIONS = [['offers', 'Offer banners'], ['tabs', 'Favourites tabs'], ['story', 'Daily ritual story'], ['deal', 'Deal of the day'], ['concerns', 'Shop by concern'], ['trending', 'Trending now'], ['promo', 'Parallax promo'], ['brands', 'Brand marquee'], ['bundles', 'Bundles'], ['testimonials', 'Testimonials'], ['ugc', 'Instagram gallery'], ['blog', 'Blog preview'], ['newsletter', 'Newsletter']];
export function SettingsManager() {
  const { data, err, reload } = useList('/api/admin/settings');
  const [s, setS] = useState(null); const [saving, setSaving] = useState(false);
  useEffect(() => { if (data) setS({ storeName: data.settings.storeName || '', email: data.settings.email || '', phone: data.settings.phone || '', gstPercent: data.settings.gstPercent ?? 18, codEnabled: data.settings.codEnabled ?? true, emailTemplates: { orderSubject: '', orderIntro: '', signature: '', ...(data.settings.emailTemplates || {}) }, homeSections: data.settings.homeSections || {} }); }, [data]);
  if (err) return <p className="rounded-xl bg-highlight/10 p-4 text-sm text-highlight" role="alert">{err}</p>;
  if (!s) return <p>Loading…</p>;
  const tpl = (k) => (e) => setS({ ...s, emailTemplates: { ...s.emailTemplates, [k]: e.target.value } });
  const save = async (e) => { e.preventDefault(); setSaving(true); try { await api('/api/admin/settings', { method: 'PUT', body: { ...s, gstPercent: Number(s.gstPercent) } }); toast.success('Settings saved'); reload(); } catch (er) { toast.error(er.message); } finally { setSaving(false); } };
  const intg = data.integrations;
  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <PageHead title="Settings" />
      <section className={`${card} grid gap-4 p-6 sm:grid-cols-2`}><h2 className="text-lg sm:col-span-2">Store</h2>
        <Field label="Store name"><input required value={s.storeName} onChange={(e) => setS({ ...s, storeName: e.target.value })} className={inputCls} /></Field>
        <Field label="Contact email"><input required type="email" value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} className={inputCls} /></Field>
        <Field label="Phone"><input value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} className={inputCls} /></Field>
        <Field label="GST included in prices (%)" help="Shown on invoices. Prices are not changed."><input type="number" min="0" max="40" value={s.gstPercent} onChange={(e) => setS({ ...s, gstPercent: e.target.value })} className={inputCls} /></Field>
        <div className="sm:col-span-2"><Check label="Allow cash on delivery" checked={s.codEnabled} onChange={(v) => setS({ ...s, codEnabled: v })} /></div></section>
      <section className={`${card} space-y-4 p-6`}><h2 className="text-lg">Order email wording</h2><p className="text-sm">Leave empty to use the default. Use {'{number}'} in the subject for the order number.</p>
        <Field label="Subject"><input value={s.emailTemplates.orderSubject} onChange={tpl('orderSubject')} placeholder="Your Lumière order {number}" className={inputCls} /></Field>
        <Field label="Opening message"><input value={s.emailTemplates.orderIntro} onChange={tpl('orderIntro')} className={inputCls} /></Field>
        <Field label="Sign-off"><input value={s.emailTemplates.signature} onChange={tpl('signature')} placeholder="With care, Team Lumière" className={inputCls} /></Field></section>
      <section className={`${card} p-6`}><h2 className="mb-3 text-lg">Home page sections</h2><div className="grid gap-2 sm:grid-cols-2">{SECTIONS.map(([k, l]) => <Check key={k} label={l} checked={s.homeSections[k] !== false} onChange={(v) => setS({ ...s, homeSections: { ...s.homeSections, [k]: v } })} />)}</div><p className="mt-3 text-xs">The hero slides are managed under Banners & home.</p></section>
      <section className={`${card} p-6`}><h2 className="mb-3 text-lg">Connections</h2><p className="mb-3 text-sm">Keys are kept in .env.local on your server, never in the database.</p>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">{[['Razorpay payments', intg.razorpay], ['QR code (UPI) payments', intg.upi], ['Razorpay webhook', intg.webhook], ['Cloudinary uploads', intg.cloudinary], ['Email (SMTP)', intg.smtp], ['Google login', intg.google]].map(([l, on]) => <li key={l} className="flex items-center justify-between rounded-xl bg-background px-4 py-2.5"><span className="text-primary">{l}</span><Pill tone={on ? 'bg-[#4d7a52] text-white' : undefined}>{on ? 'Connected' : 'Not set'}</Pill></li>)}</ul></section>
      <Button type="submit" size="lg" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</Button>
    </form>
  );
}
