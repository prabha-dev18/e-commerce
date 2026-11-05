'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { if (!localStorage.getItem('lumiere-cookies')) setTimeout(() => setShow(true), 1200); } catch {}
  }, []);
  const choose = (v) => { try { localStorage.setItem('lumiere-cookies', v); } catch {} setShow(false); };

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-[60] mx-auto max-w-xl glass rounded-3xl p-5 md:bottom-6 md:left-6 md:right-auto">
          <p className="text-sm text-primary">We use cookies to keep your bag saved and to understand which products you like.</p>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={() => choose('all')}>Accept all</Button>
            <Button size="sm" variant="soft" onClick={() => choose('essential')}>Essential only</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
