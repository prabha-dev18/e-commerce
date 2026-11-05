'use client';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export async function api(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...opts.headers }, body: opts.body && typeof opts.body !== 'string' ? JSON.stringify(opts.body) : opts.body });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Something went wrong');
  return j;
}

/** Fetches a list endpoint and refetches when params change. */
export function useList(base, params = {}) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null && v !== false)).toString();
  const load = useCallback(() => { setLoading(true); return api(`${base}${qs ? `?${qs}` : ''}`).then((d) => { setData(d); setErr(''); }).catch((e) => setErr(e.message)).finally(() => setLoading(false)); }, [base, qs]);
  useEffect(() => { load(); }, [load]);
  return { data, err, loading, reload: load };
}

export const card = 'rounded-2xl bg-white shadow-soft';
export const inputCls = 'h-11 w-full rounded-xl bg-background px-3.5 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent';
export const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const dt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export function PageHead({ title, sub, children }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl sm:text-3xl">{title}</h1>{sub && <p className="mt-1 text-sm">{sub}</p>}</div><div className="flex flex-wrap items-center gap-2">{children}</div></div>;
}
export function Pager({ page, pages, onPage }) {
  if (!pages || pages <= 1) return null;
  return <div className="mt-5 flex items-center justify-center gap-3 text-sm"><button aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded-full bg-white p-2 shadow-soft disabled:opacity-40"><ChevronLeft size={16} /></button>Page {page} of {pages}<button aria-label="Next page" disabled={page >= pages} onClick={() => onPage(page + 1)} className="rounded-full bg-white p-2 shadow-soft disabled:opacity-40"><ChevronRight size={16} /></button></div>;
}
export function Table({ cols, rows, onRow, empty = 'Nothing here yet.', loading }) {
  return (
    <div className={`${card} overflow-x-auto`}>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead><tr className="border-b border-secondary text-xs uppercase tracking-wide">{cols.map((c) => <th key={c.label} className={cn('px-4 py-3 font-medium', c.right && 'text-right')}>{c.label}</th>)}</tr></thead>
        <tbody>
          {(rows || []).map((r, i) => (
            <tr key={r.id || r._id || i} onClick={onRow ? () => onRow(r) : undefined} className={cn('border-b border-secondary/60 last:border-0', onRow && 'cursor-pointer hover:bg-background')}>
              {cols.map((c) => <td key={c.label} className={cn('px-4 py-3 align-middle', c.right && 'text-right')}>{c.render ? c.render(r) : r[c.key]}</td>)}
            </tr>
          ))}
          {rows && rows.length === 0 && <tr><td colSpan={cols.length} className="px-4 py-12 text-center">{empty}</td></tr>}
          {!rows && <tr><td colSpan={cols.length} className="px-4 py-12 text-center">{loading === false ? empty : 'Loading…'}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
export function Field({ label, help, children, className }) {
  return <label className={cn('block text-sm font-medium text-primary', className)}>{label}<span className="mt-1.5 block font-normal">{children}</span>{help && <span className="mt-1 block text-xs font-normal">{help}</span>}</label>;
}
export function Check({ label, checked, onChange }) {
  return <label className="flex cursor-pointer items-center gap-2 text-sm text-primary"><input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#2A211D]" />{label}</label>;
}
export function Pill({ children, tone = 'bg-secondary text-primary' }) {
  return <span className={cn('inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide', tone)}>{children}</span>;
}
export const SearchBox = ({ value, onChange, placeholder = 'Search…' }) => <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className={`${inputCls} w-56`} />;
