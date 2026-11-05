'use client';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Drawer({ open, onClose, title, side = 'right', width = 'max-w-md', children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  const from = side === 'right' ? '100%' : '-100%';
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className={cn('absolute top-0 flex h-full w-full flex-col bg-white shadow-lift', width, side === 'right' ? 'right-0' : 'left-0')}
            initial={{ x: from }} animate={{ x: 0 }} exit={{ x: from }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-secondary px-5 py-4">
              <h2 className="font-serif text-xl">{title}</h2>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-primary hover:bg-secondary"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
            {footer && <div className="border-t border-secondary p-5">{footer}</div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
