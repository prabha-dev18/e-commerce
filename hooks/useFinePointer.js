'use client';
import { useEffect, useState } from 'react';

/** True on devices with a real mouse. Used to switch off hover-only effects (cursor, magnetic, tilt) on touch screens. */
export default function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(pointer: fine) and (hover: hover)');
    const on = () => setFine(m.matches);
    on();
    m.addEventListener?.('change', on);
    return () => m.removeEventListener?.('change', on);
  }, []);
  return fine;
}
