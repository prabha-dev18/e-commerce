'use client';
import { useEffect, useMemo, useState } from 'react';
import { ThumbsUp, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Rating from '@/components/ui/Rating';
import Button from '@/components/ui/Button';
import { reviewsFor, distribution } from '@/lib/catalog';

export default function ReviewsSection({ product: p }) {
  const [filter, setFilter] = useState(0);
  const [sort, setSort] = useState('helpful');
  const [mine, setMine] = useState([]);
  const [helpful, setHelpful] = useState({});
  const [form, setForm] = useState({ rating: 5, text: '' });
  const dist = distribution(p);
  const all = useMemo(() => [...mine, ...reviewsFor(p)], [mine, p]);
  const shown = all.filter((r) => !filter || r.rating === filter).sort((a, b) => (sort === 'helpful' ? b.helpful - a.helpful : sort === 'high' ? b.rating - a.rating : a.rating - b.rating));

  useEffect(() => {
    fetch(`/api/reviews?productId=${encodeURIComponent(p.id)}`).then((r) => (r.ok ? r.json() : null)).then((j) => j && setMine(j.items)).catch(() => {});
  }, [p.id]);

  const voteHelpful = async (id) => {
    if (helpful[id]) return;
    setHelpful((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/reviews/${id}/helpful`, { method: 'POST' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        if (res.status === 401) toast.error('Please log in to vote');
        else if (res.status === 409) toast.error(j.error || 'Already voted');
        else toast.error(j.error || 'Could not register vote');
        setHelpful((prev) => ({ ...prev, [id]: false }));
      } else {
        toast.success('Marked as helpful');
      }
    } catch {
      // Offline fallback
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.text.trim().length < 10) return toast.error('Write at least 10 characters');
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: p.id, rating: form.rating, text: form.text }) });
      const j = await res.json().catch(() => ({}));
      if (res.status === 401) return toast.error('Please log in to write a review');
      if (!res.ok) return toast.error(j.error || 'Could not submit your review');
      setForm({ rating: 5, text: '' });
      toast.success(j.message);
    } catch { toast.error('Could not reach the server. Try again.'); }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
      <div>
        <p className="font-serif text-5xl text-primary">{p.rating}</p>
        <div className="mt-2"><Rating value={p.rating} count={p.reviews} size={18} /></div>
        <ul className="mt-5 space-y-2">
          {dist.map((pct, k) => (
            <li key={k}><button onClick={() => setFilter(filter === 5 - k ? 0 : 5 - k)} className="flex w-full items-center gap-3 text-sm" aria-pressed={filter === 5 - k}>
              <span className="w-8">{5 - k} ★</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary"><span className="block h-full bg-accent" style={{ width: `${pct}%` }} /></span>
              <span className="w-9 text-right">{pct}%</span>
            </button></li>
          ))}
        </ul>
        <form onSubmit={submit} className="mt-8 rounded-2xl bg-white p-5 shadow-soft">
          <h3 className="text-lg">Write a review</h3>
          <p className="mt-1 text-xs">Only verified buyers can publish reviews.</p>
          <div className="mt-3 flex gap-1" role="radiogroup" aria-label="Your rating">
            {[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} aria-label={`${n} stars`} onClick={() => setForm({ ...form, rating: n })} className={`text-2xl ${n <= form.rating ? 'text-accent' : 'text-secondary'}`}>★</button>)}
          </div>
          <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} placeholder="What did you like or dislike?" aria-label="Review text" className="mt-3 w-full rounded-xl bg-background p-3 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent" />
          <Button type="submit" size="sm" className="mt-3">Submit review</Button>
        </form>
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm">{shown.length} review{shown.length === 1 ? '' : 's'}{filter ? ` with ${filter} stars` : ''}</p>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort reviews" className="rounded-full bg-secondary px-3 py-2 text-sm text-primary outline-none">
            <option value="helpful">Most helpful</option><option value="high">Highest rated</option><option value="low">Lowest rated</option>
          </select>
        </div>
        <ul className="divide-y divide-secondary">
          {shown.map((r) => (
            <li key={r.id} className="py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-serif text-white">{r.name[0]}</span>
                <div><p className="text-sm font-medium text-primary">{r.name}</p><p className="flex items-center gap-1 text-xs">{r.verified && <><BadgeCheck size={12} className="text-accent" /> Verified buyer · </>}{r.date}</p></div>
              </div>
              <div className="mt-3"><Rating value={r.rating} /></div>
              <p className="mt-2 text-sm leading-relaxed">{r.text}</p>
              <button onClick={() => voteHelpful(r.id)} aria-pressed={!!helpful[r.id]} className="mt-3 flex items-center gap-1.5 text-xs text-primary"><ThumbsUp size={13} className={helpful[r.id] ? 'fill-accent text-accent' : ''} /> Helpful ({r.helpful + (helpful[r.id] ? 1 : 0)})</button>
            </li>
          ))}
          {shown.length === 0 && <li className="py-10 text-center text-sm">No reviews with this rating yet.</li>}
        </ul>
      </div>
    </div>
  );
}
