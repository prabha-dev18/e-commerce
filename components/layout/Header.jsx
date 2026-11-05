'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Heart, ShoppingBag, User, Menu, Search } from 'lucide-react';
import SearchBar from './SearchBar';
import CategoryNav from './CategoryNav';
import { useStore } from '@/store/useStore';
import useHydrated from '@/hooks/useHydrated';
import { formatPrice, SITE_NAME } from '@/lib/utils';

function IconLink({ href, onClick, label, count, children }) {
  const inner = (
    <>
      {children}
      <AnimatePresence>
        {count > 0 && (
          <motion.span key={count} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}
            className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-highlight px-1 text-[10px] font-semibold text-white">
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
  const cls = 'relative rounded-full p-2.5 text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-soft';
  return href ? <Link href={href} aria-label={label} className={cls}>{inner}</Link> : <button onClick={onClick} aria-label={label} className={cls}>{inner}</button>;
}

export default function Header() {
  const ready = useHydrated();
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setMenuOpen = useStore((s) => s.setMenuOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40));
  const count = ready ? cart.reduce((n, i) => n + i.qty, 0) : 0;
  const total = ready ? cart.reduce((n, i) => n + i.qty * i.price, 0) : 0;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-500 ${scrolled ? 'bg-white/90 shadow-[0_1px_0_rgba(185,154,107,0.35),0_14px_40px_rgba(42,33,29,0.10)]' : 'bg-white/55 shadow-[0_1px_0_rgba(185,154,107,0.2)]'}`}>
      <div className={`container-x flex items-center gap-4 transition-all duration-500 lg:gap-8 ${scrolled ? 'h-14 lg:h-[60px]' : 'h-16 lg:h-[80px]'}`}>
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="group flex items-center gap-2 rounded-full p-2 text-primary transition-colors hover:bg-secondary"><Menu size={22} /><span className="label-sm hidden lg:inline">Menu</span></button>
        <Link href="/" className="font-serif text-3xl font-bold tracking-wide text-primary transition-transform hover:scale-105 lg:text-4xl" aria-label={`${SITE_NAME} home`}>
          {SITE_NAME}<span className="text-gold">.</span>
        </Link>
        <div className="mx-auto hidden max-w-2xl flex-1 md:block"><SearchBar /></div>
        <div className="ml-auto flex items-center gap-0.5 md:ml-0">
          <IconLink onClick={() => setSearchOpen(true)} label="Search"><Search size={21} className="md:hidden" /></IconLink>
          <IconLink href="/account" label="Account"><User size={21} /></IconLink>
          <IconLink href="/wishlist" label="Wishlist" count={ready ? wishlist.length : 0}><Heart size={21} /></IconLink>
          <button onClick={() => setCartOpen(true)} aria-label="Open cart" className="relative ml-1 flex items-center gap-2 rounded-full p-2.5 text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-soft">
            <span className="relative"><ShoppingBag size={21} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span key={count} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}
                    className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-highlight px-1 text-[10px] font-semibold text-white">{count}</motion.span>
                )}
              </AnimatePresence>
            </span>
            <span className="hidden text-sm font-medium xl:block">{formatPrice(total)}</span>
          </button>
        </div>
      </div>
      <CategoryNav />
    </header>
  );
}
