'use client';
import { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { facets, shadeFamilies } from '@/lib/catalog';
import { cn } from '@/lib/utils';

function Group({ title, children, open: o = true }) {
  const [open, setOpen] = useState(o);
  return (
    <div className="border-b border-secondary py-4">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between text-left font-medium text-primary">
        {title}<ChevronDown size={16} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

const Check = ({ checked, onChange, label }) => (
  <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
    <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-accent accent-[#2A211D]" />
    <span className={checked ? 'text-primary' : ''}>{label}</span>
  </label>
);

export default function FilterPanel({ params, toggle, set, clear, hasFilters }) {
  const has = (k, v) => (params[k] || '').split(',').includes(v);
  const multi = (k, opts) => opts.map(([v, l]) => <Check key={v} checked={has(k, v)} onChange={() => toggle(k, v)} label={l} />);
  const min = Number(params.min) || 0;
  const max = Number(params.max) || 2000;

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h2 className="font-serif text-xl">Filters</h2>
        {hasFilters && <button onClick={clear} className="text-sm text-highlight underline">Clear all</button>}
      </div>
      <Group title="Category">{multi('category', facets.category)}</Group>
      <Group title="Brand">{multi('brand', facets.brand)}</Group>
      <Group title="Price">
        <p className="mb-3 text-sm text-primary">₹{min} to ₹{max}{max === 2000 ? '+' : ''}</p>
        <label className="text-xs">Minimum<input type="range" min={0} max={2000} step={50} value={min} onChange={(e) => set({ min: Number(e.target.value) > 0 ? e.target.value : '' })} className="w-full accent-[#B99A6B]" /></label>
        <label className="text-xs">Maximum<input type="range" min={0} max={2000} step={50} value={max} onChange={(e) => set({ max: Number(e.target.value) < 2000 ? e.target.value : '' })} className="w-full accent-[#B99A6B]" /></label>
      </Group>
      <Group title="Rating">
        {[4, 3].map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
            <input type="radio" name="rating" checked={params.rating === String(r)} onChange={() => set({ rating: String(r) })} className="accent-[#2A211D]" />
            <span className="flex items-center gap-1">{r} <Star size={13} className="fill-accent text-accent" /> and up</span>
          </label>
        ))}
        {params.rating && <button onClick={() => set({ rating: '' })} className="mt-1 text-xs underline">Reset</button>}
      </Group>
      <Group title="Skin type" open={false}>{multi('skin', facets.skin)}</Group>
      <Group title="Concern" open={false}>{multi('concern', facets.concern)}</Group>
      <Group title="Finish" open={false}>{multi('finish', facets.finish)}</Group>
      <Group title="Shade" open={false}>
        <div className="flex flex-wrap gap-2.5">
          {shadeFamilies.map((s) => (
            <button key={s.name} title={s.name} aria-label={s.name} aria-pressed={has('shade', s.name)} onClick={() => toggle('shade', s.name)}
              className={cn('h-7 w-7 rounded-full ring-offset-2 transition', has('shade', s.name) ? 'ring-2 ring-primary' : 'ring-1 ring-secondary')} style={{ background: s.hex }} />
          ))}
        </div>
      </Group>
      <Group title="Size" open={false}>{multi('size', facets.size)}</Group>
      <Group title="Discount" open={false}>
        {[10, 20, 30].map((d) => (
          <label key={d} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
            <input type="radio" name="discount" checked={params.discount === String(d)} onChange={() => set({ discount: String(d) })} className="accent-[#2A211D]" />{d}% or more
          </label>
        ))}
        {params.discount && <button onClick={() => set({ discount: '' })} className="mt-1 text-xs underline">Reset</button>}
      </Group>
      <Group title="Availability & values">
        <Check checked={params.stock === '1'} onChange={() => set({ stock: params.stock === '1' ? '' : '1' })} label="In stock only" />
        <Check checked={params.vegan === '1'} onChange={() => set({ vegan: params.vegan === '1' ? '' : '1' })} label="Vegan" />
        <Check checked={params.cf === '1'} onChange={() => set({ cf: params.cf === '1' ? '' : '1' })} label="Cruelty-free" />
        <Check checked={params.pf === '1'} onChange={() => set({ pf: params.pf === '1' ? '' : '1' })} label="Paraben-free" />
      </Group>
    </div>
  );
}
