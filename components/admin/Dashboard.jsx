'use client';
import Link from 'next/link';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { IndianRupee, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { useList, card, money, dt, Pill, PageHead } from './ui';
import { statusTone } from '@/components/order/OrderTimeline';

const Stat = ({ icon: Icon, label, value, sub }) => (
  <div className={`${card} p-5`}><div className="flex items-center justify-between"><p className="text-sm">{label}</p><Icon size={18} className="text-accent" /></div><p className="mt-2 font-serif text-3xl text-primary">{value}</p>{sub && <p className="mt-1 text-xs">{sub}</p>}</div>
);

export default function Dashboard() {
  const { data: d, err } = useList('/api/admin/dashboard');
  if (err) return <p className="rounded-xl bg-highlight/10 p-4 text-sm text-highlight" role="alert">{err}</p>;
  if (!d) return <p>Loading dashboard…</p>;
  const todo = [['returns', d.pending.returns, '/admin/returns', 'return requests'], ['reviews', d.pending.reviews, '/admin/reviews', 'reviews to approve'], ['messages', d.pending.messages, '/admin/messages', 'unread messages']].filter((t) => t[1] > 0);
  return (
    <div className="space-y-6">
      <PageHead title="Dashboard" sub="Cancelled and returned orders are not counted in sales." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={IndianRupee} label="Total sales" value={money(d.totals.revenue)} sub={`${money(d.totals.last30)} in the last 30 days`} />
        <Stat icon={ShoppingBag} label="Orders" value={d.totals.orders} />
        <Stat icon={TrendingUp} label="Average order value" value={money(d.totals.aov)} />
        <Stat icon={Users} label="Customers" value={d.totals.customers} />
      </div>
      {todo.length > 0 && <div className="flex flex-wrap gap-3">{todo.map(([k, n, href, l]) => <Link key={k} href={href} className="rounded-full bg-accent px-4 py-2 text-sm text-white hover:bg-primary">{n} {l}</Link>)}</div>}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className={`${card} p-5 xl:col-span-2`}>
          <h2 className="mb-4 text-lg">Revenue, last 30 days</h2>
          <div className="h-64"><ResponsiveContainer><AreaChart data={d.days}><defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#B99A6B" stopOpacity={0.5} /><stop offset="95%" stopColor="#B99A6B" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE3D8" /><XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} /><YAxis tick={{ fontSize: 11 }} width={50} /><Tooltip formatter={(v, n) => [n === 'revenue' ? money(v) : v, n]} />
            <Area type="monotone" dataKey="revenue" stroke="#B99A6B" fill="url(#rev)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
        </div>
        <div className={`${card} p-5`}>
          <h2 className="mb-4 text-lg">Orders by status</h2>
          <div className="h-64"><ResponsiveContainer><BarChart data={d.byStatus} layout="vertical" margin={{ left: 10 }}><XAxis type="number" hide /><YAxis type="category" dataKey="status" tick={{ fontSize: 12 }} width={80} /><Tooltip /><Bar dataKey="count" fill="#2A211D" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${card} p-5`}><h2 className="mb-3 text-lg">Top products</h2>{d.top.length === 0 ? <p className="text-sm">No sales yet.</p> : <ul className="space-y-2 text-sm">{d.top.map((p) => <li key={p._id} className="flex justify-between gap-3"><span className="truncate text-primary">{p.name}</span><span>{p.qty} sold · {money(p.revenue)}</span></li>)}</ul>}</div>
        <div className={`${card} p-5`}><h2 className="mb-3 text-lg">Low stock</h2>{d.low.length === 0 ? <p className="text-sm">All stocked up.</p> : <ul className="space-y-2 text-sm">{d.low.map((p) => <li key={p.id} className="flex justify-between gap-3"><span className="truncate text-primary">{p.name}</span><Pill tone={p.stock === 0 ? 'bg-highlight text-white' : undefined}>{p.stock === 0 ? 'Out' : `${p.stock} left`}</Pill></li>)}</ul>}<Link href="/admin/products" className="mt-3 block text-xs underline">Manage products</Link></div>
        <div className={`${card} p-5`}><h2 className="mb-3 text-lg">Recent orders</h2>{d.recent.length === 0 ? <p className="text-sm">No orders yet.</p> : <ul className="space-y-2 text-sm">{d.recent.map((o) => <li key={o._id} className="flex items-center justify-between gap-3"><span className="min-w-0"><Link href="/admin/orders" className="text-primary hover:text-accent">{o.number}</Link><br /><span className="text-xs">{o.address?.name} · {dt(o.createdAt)}</span></span><span className="text-right">{money(o.total)}<br /><Pill tone={statusTone[o.status]}>{o.status}</Pill></span></li>)}</ul>}</div>
      </div>
    </div>
  );
}
