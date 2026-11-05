'use client';
import { useEffect, useState } from 'react';
import { catalog } from '@/lib/catalog';

/** Loads products for a list of ids from the API (so admin edits show), with the bundled catalog as a fallback. */
export default function useProductsByIds(ids) {
  const key = ids.join(',');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!ids.length) { setItems([]); setLoading(false); return; }
    let off = false;
    const order = (list) => ids.map((id) => list.find((p) => p.id === id)).filter(Boolean);
    setLoading(true);
    fetch(`/api/products?ids=${encodeURIComponent(key)}&limit=48`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('api'))))
      .then((j) => order(j.items))
      .catch(() => order(catalog))
      .then((list) => { if (!off) { setItems(list); setLoading(false); } });
    return () => { off = true; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return { items, loading };
}
