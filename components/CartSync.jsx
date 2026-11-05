'use client';
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/useStore';
import useHydrated from '@/hooks/useHydrated';

const put = (url, body) => fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {});

/** For logged-in customers: merges the local bag/wishlist with the saved ones, then keeps the server copy updated. */
export default function CartSync() {
  const { status } = useSession();
  const ready = useHydrated();
  const synced = useRef(false);

  useEffect(() => {
    if (!ready || status !== 'authenticated') { synced.current = false; return; }
    (async () => {
      try {
        const [c, w] = await Promise.all([fetch('/api/cart').then((r) => r.json()), fetch('/api/wishlist').then((r) => r.json())]);
        const local = useStore.getState();
        const map = new Map();
        [...(c.items || []), ...local.cart].forEach((i) => { const o = map.get(i.key); map.set(i.key, o ? { ...i, qty: Math.min(10, Math.max(o.qty, i.qty)) } : i); });
        synced.current = true; // set first so the merged result is pushed back to the server
        useStore.setState({ cart: [...map.values()], wishlist: [...new Set([...(w.ids || []), ...local.wishlist])] });
      } catch { /* offline or no database: keep working locally */ }
    })();
  }, [ready, status]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    let t1, t2;
    const unsub = useStore.subscribe((s, prev) => {
      if (!synced.current) return;
      if (s.cart !== prev.cart) {
        clearTimeout(t1);
        t1 = setTimeout(() => put('/api/cart', { items: s.cart.map(({ key, id, slug, name, price, image, variant, qty }) => ({ key, id, slug: slug || id, name, price, image: image || null, variant: variant || null, qty })) }), 800);
      }
      if (s.wishlist !== prev.wishlist) { clearTimeout(t2); t2 = setTimeout(() => put('/api/wishlist', { ids: s.wishlist }), 800); }
    });
    return () => { unsub(); clearTimeout(t1); clearTimeout(t2); };
  }, [status]);

  return null;
}
