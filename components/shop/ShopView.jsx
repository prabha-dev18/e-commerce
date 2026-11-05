'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LayoutGrid, List, SlidersHorizontal, X, ChevronRight, SearchX } from 'lucide-react';
import FilterPanel from './FilterPanel';
import ProductCard from '@/components/product/ProductCard';
import ProductRow from '@/components/product/ProductRow';
import QuickView from '@/components/product/QuickView';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { filterProducts, facets } from '@/lib/catalog';
import { cn } from '@/lib/utils';

const PER_PAGE = 9;
const FILTER_KEYS = ['category', 'sub', 'brand', 'skin', 'concern', 'finish', 'size', 'shade', 'min', 'max', 'rating', 'discount', 'stock', 'vegan', 'cf', 'pf'];
const labelOf = (k, v) => (facets[k]?.find(([x]) => x === v)?.[1]) || v.replace(/-/g, ' ');

export default function ShopView({ mode = 'shop' }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const params = useMemo(() => Object.fromEntries(sp.entries()), [sp]);
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [qv, setQv] = useState(null);

  const push = (next) => {
    const q = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => v && q.set(k, v));
    router.replace(`${pathname}${q.toString() ? `?${q}` : ''}`, { scroll: false });
  };
  const set = (patch) => push({ ...params, ...patch, page: '' });
  const toggle = (k, v) => {
    const cur = (params[k] || '').split(',').filter(Boolean);
    set({ [k]: (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]).join(',') });
  };
  const clear = () => push({ q: params.q, sort: params.sort });

  const page = Math.max(1, Number(params.page) || 1);
  const [data, setData] = useState({ items: [], total: 0 });
  const pages = Math.max(1, Math.ceil(data.total / PER_PAGE));

  // Loads from /api/products (MongoDB). If the API or database is unavailable it falls back to the bundled catalog.
  useEffect(() => {
    let off = false;
    setLoading(true);
    const qs = new URLSearchParams({ ...params, limit: String(PER_PAGE) }).toString();
    fetch(`/api/products?${qs}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('api'))))
      .catch(() => { const all = filterProducts(params); return { items: all.slice((page - 1) * PER_PAGE, page * PER_PAGE), total: all.length }; })
      .then((d) => { if (!off) { setData(d); setLoading(false); } });
    return () => { off = true; };
  }, [sp]); // eslint-disable-line react-hooks/exhaustive-deps

  const chips = FILTER_KEYS.flatMap((k) => (params[k] ? (['min', 'max', 'rating', 'discount'].includes(k) ? [[k, params[k], k === 'min' ? `From ₹${params[k]}` : k === 'max' ? `Up to ₹${params[k]}` : k === 'rating' ? `${params[k]}★ & up` : `${params[k]}%+ off`]] : params[k].split(',').map((v) => [k, v, labelOf(k, v)])) : []));
  const removeChip = (k, v) => (['category', 'sub', 'brand', 'skin', 'concern', 'finish', 'size', 'shade'].includes(k) ? toggle(k, v) : set({ [k]: '' }));
  const title = mode === 'search' ? (params.q ? `Results for "${params.q}"` : 'Search') : params.category ? labelOf('category', params.category.split(',')[0]) : 'All products';
  const panel = <FilterPanel params={params} toggle={toggle} set={set} clear={clear} hasFilters={chips.length > 0} />;

  return (
    <div className="container-x py-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-xs">
        <Link href="/" className="hover:text-primary">Home</Link><ChevronRight size={12} />
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        {title !== 'All products' && <><ChevronRight size={12} /><span className="text-primary">{title}</span></>}
      </nav>
      <h1 className="text-3xl sm:text-4xl">{title}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">{panel}</div></aside>

        <div>
          <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setDrawer(true)} className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-primary lg:hidden"><SlidersHorizontal size={15} /> Filters{chips.length ? ` (${chips.length})` : ''}</button>
              <p className="text-sm" aria-live="polite">{data.total} product{data.total === 1 ? '' : 's'}</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <span className="hidden sm:inline">Sort by</span>
                <select value={params.sort || 'popularity'} onChange={(e) => set({ sort: e.target.value })} className="rounded-full bg-secondary px-3 py-2 text-sm text-primary outline-none">
                  {facets.sort.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <div className="hidden overflow-hidden rounded-full bg-secondary sm:flex" role="group" aria-label="View">
                {[['grid', LayoutGrid], ['list', List]].map(([v, Icon]) => (
                  <button key={v} aria-label={`${v} view`} aria-pressed={view === v} onClick={() => setView(v)} className={cn('p-2.5', view === v ? 'bg-primary text-white' : 'text-primary')}><Icon size={16} /></button>
                ))}
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map(([k, v, l]) => (
                <button key={k + v} onClick={() => removeChip(k, v)} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs text-primary hover:bg-accent/30">{l}<X size={12} /></button>
              ))}
              <button onClick={clear} className="text-xs text-highlight underline">Clear all</button>
            </div>
          )}

          <div className="mt-6">
            {loading ? (
              <div className={view === 'grid' ? 'grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3' : 'space-y-4'}>
                {Array.from({ length: 6 }).map((_, i) => view === 'grid' ? <Skeleton key={i} className="aspect-[3/4]" /> : <Skeleton key={i} className="h-44" />)}
              </div>
            ) : data.items.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-white py-20 text-center shadow-soft">
                <SearchX size={40} className="text-accent" />
                <h2 className="text-xl">No products match</h2>
                <p className="text-sm">Remove a filter or try a different search.</p>
                <Button onClick={clear} variant="outline">Clear filters</Button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">{data.items.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQv} />)}</div>
            ) : (
              <div className="space-y-4">{data.items.map((p) => <ProductRow key={p.id} product={p} onQuickView={setQv} />)}</div>
            )}
          </div>

          {pages > 1 && !loading && (
            <nav aria-label="Pagination" className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} aria-current={page === i + 1} onClick={() => { push({ ...params, page: i === 0 ? '' : String(i + 1) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={cn('h-10 w-10 rounded-full text-sm', page === i + 1 ? 'bg-primary text-white' : 'bg-white text-primary shadow-soft hover:bg-secondary')}>{i + 1}</button>
              ))}
            </nav>
          )}
        </div>
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Filters" side="left" width="max-w-sm" footer={<Button onClick={() => setDrawer(false)} className="w-full">Show {data.total} products</Button>}>
        <div className="px-5">{panel}</div>
      </Drawer>
      <QuickView product={qv} onClose={() => setQv(null)} />
    </div>
  );
}
