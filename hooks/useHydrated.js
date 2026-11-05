'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

/** Rehydrates the persisted store on the client and returns true once ready (avoids SSR mismatch). */
export default function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    useStore.persist.rehydrate();
    setReady(true);
  }, []);
  return ready;
}
