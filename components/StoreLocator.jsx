'use client';
import { useMemo, useState } from 'react';
import { Phone, Clock, Navigation } from 'lucide-react';
import { stores } from '@/data/stores';
import { cn } from '@/lib/utils';

const cities = ['All', ...new Set(stores.map((s) => s.city))];
export default function StoreLocator() {
  const [city, setCity] = useState('All');
  const list = useMemo(() => stores.filter((s) => city === 'All' || s.city === city), [city]);
  const [sel, setSel] = useState(stores[0].id);
  const cur = list.find((s) => s.id === sel) || list[0];
  const d = 0.012;
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Cities">
        {cities.map((c) => <button key={c} role="tab" aria-selected={city === c} onClick={() => { setCity(c); const first = stores.find((s) => c === 'All' || s.city === c); if (first) setSel(first.id); }} className={cn('rounded-full px-5 py-2 text-sm', city === c ? 'bg-primary text-white' : 'bg-white text-primary shadow-soft hover:bg-secondary')}>{c}</button>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <ul className="space-y-3">
          {list.map((s) => (
            <li key={s.id}><div className={cn('rounded-2xl bg-white p-5 shadow-soft ring-2 transition', cur?.id === s.id ? 'ring-accent' : 'ring-transparent')}>
              <button onClick={() => setSel(s.id)} className="w-full text-left"><p className="font-serif text-xl text-primary">{s.name}</p><p className="mt-1 text-sm">{s.address}</p></button>
              <p className="mt-3 flex items-center gap-2 text-sm"><Clock size={14} className="text-accent" />{s.hours}</p>
              <div className="mt-3 flex gap-2"><a href={`tel:${s.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs text-primary hover:bg-accent hover:text-white"><Phone size={13} /> Call</a><a href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs text-white hover:bg-accent"><Navigation size={13} /> Directions</a></div>
            </div></li>
          ))}
        </ul>
        {cur && <div className="overflow-hidden rounded-2xl shadow-soft"><iframe key={cur.id} title={`Map of ${cur.name}`} loading="lazy" referrerPolicy="no-referrer" className="h-[420px] w-full border-0 lg:h-full lg:min-h-[420px]" src={`https://www.openstreetmap.org/export/embed.html?bbox=${cur.lng - d}%2C${cur.lat - d}%2C${cur.lng + d}%2C${cur.lat + d}&layer=mapnik&marker=${cur.lat}%2C${cur.lng}`} /></div>}
      </div>
    </div>
  );
}
