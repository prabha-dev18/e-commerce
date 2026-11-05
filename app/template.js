'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

let firstLoad = true;

// Re-mounts on every route change. A dark curtain with a curved edge lifts to reveal the new page, which then rises in.
export default function Template({ children }) {
  const pathname = usePathname() || '';
  const admin = pathname.startsWith('/admin');
  const play = useRef(!firstLoad && !admin);
  useEffect(() => { firstLoad = false; }, []);

  if (admin) return children;
  return (
    <>
      {play.current && (
        <motion.div aria-hidden="true" initial={{ y: 0, borderBottomLeftRadius: '0%', borderBottomRightRadius: '0%' }} animate={{ y: '-105%', borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%' }} transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.05 }} className="pointer-events-none fixed inset-0 z-[150] bg-primary" />
      )}
      <motion.div initial={play.current ? { opacity: 0, y: 40 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: play.current ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </>
  );
}
