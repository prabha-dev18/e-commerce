'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { GitCompareArrows } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function CompareBar() {
  const n = useStore((s) => s.compare.length);
  const pathname = usePathname();
  return (
    <AnimatePresence>
      {n > 0 && pathname !== '/compare' && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 md:bottom-6">
          <Link href="/compare" className="flex items-center gap-3 rounded-full bg-primary px-5 py-3 text-sm text-white shadow-lift">
            <GitCompareArrows size={16} className="text-accent" /> Compare ({n}/4)
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
