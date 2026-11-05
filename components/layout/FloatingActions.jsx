'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, MessageCircle } from 'lucide-react';

export default function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3 md:bottom-6 md:right-6">
      <AnimatePresence>
        {show && (
          <motion.button initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-primary transition-transform hover:-translate-y-1 hover:bg-white">
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
      <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 animate-float items-center justify-center rounded-full bg-[#25D366] text-white shadow-3d transition-transform hover:scale-110">
        <MessageCircle size={22} />
      </a>
    </div>
  );
}
