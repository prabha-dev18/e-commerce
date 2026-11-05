'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useDebounce from '@/hooks/useDebounce';
import { categories, searchSuggestions } from '@/data/nav';

export default function SearchBar({ autoFocus = false }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [open, setOpen] = useState(false);
  const dq = useDebounce(q, 200);
  const box = useRef(null);

  const local = dq.trim()
    ? [...categories.map((c) => c.label), ...searchSuggestions].filter((s) => s.toLowerCase().includes(dq.toLowerCase())).slice(0, 6)
    : [];
  const [remote, setRemote] = useState(null);
  useEffect(() => {
    if (dq.trim().length < 2) { setRemote(null); return; }
    let off = false;
    fetch(`/api/products/autosuggest?q=${encodeURIComponent(dq)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('api'))))
      .then((j) => !off && setRemote(j.suggestions.map((s) => s.name)))
      .catch(() => !off && setRemote(null));
    return () => { off = true; };
  }, [dq]);
  const results = remote?.length ? remote : local;

  useEffect(() => {
    const close = (e) => box.current && !box.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const go = (term) => {
    if (!term.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}${cat ? `&category=${cat}` : ''}`);
  };

  return (
    <div ref={box} className="relative w-full">
      <form onSubmit={(e) => { e.preventDefault(); go(q); }} className="flex h-11 w-full items-center overflow-hidden rounded-full border border-accent/30 bg-background focus-within:border-accent">
        <div className="relative hidden border-r border-accent/30 sm:block">
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Search category" className="h-11 appearance-none bg-transparent pl-4 pr-8 text-sm text-primary outline-none">
            <option value="">All</option>
            {categories.map((c) => <option key={c.label} value={c.label.toLowerCase()}>{c.label}</option>)}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-body" />
        </div>
        <input
          autoFocus={autoFocus} value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          placeholder="Search serums, lipsticks, brands…" aria-label="Search products"
          className="h-full flex-1 bg-transparent px-4 text-sm text-primary placeholder:text-body/70 outline-none"
        />
        <button type="submit" aria-label="Search" className="flex h-full w-12 items-center justify-center bg-primary text-white transition-colors hover:bg-accent"><Search size={18} /></button>
      </form>
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-white py-2 shadow-lift">
            {results.map((r) => (
              <li key={r}><button onClick={() => { setQ(r); go(r); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-primary hover:bg-secondary"><Search size={14} className="text-accent" /> {r}</button></li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
