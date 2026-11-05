'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, ShoppingBag, User, ChevronRight } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';
import SearchBar from './SearchBar';
import FullMenu from './FullMenu';
import { useStore } from '@/store/useStore';
import useHydrated from '@/hooks/useHydrated';
import { categories, quickLinks } from '@/data/nav';
import { cn } from '@/lib/utils';

export default function MobileNav() {
  const pathname = usePathname();
  const ready = useHydrated();
  const { menuOpen, setMenuOpen, searchOpen, setSearchOpen, setCartOpen } = useStore();
  const count = useStore((s) => s.cart.reduce((n, i) => n + i.qty, 0));

  const tabs = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Categories', icon: LayoutGrid, onClick: () => setMenuOpen(true) },
    { label: 'Search', icon: Search, onClick: () => setSearchOpen(true) },
    { label: 'Cart', icon: ShoppingBag, onClick: () => setCartOpen(true), badge: ready ? count : 0 },
    { label: 'Account', icon: User, href: '/account' },
  ];

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-accent/30 bg-white/80 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(42,33,29,0.08)] backdrop-blur-xl md:hidden" aria-label="Mobile">
        <ul className="grid grid-cols-5">
          {tabs.map(({ label, icon: Icon, href, onClick, badge }) => {
            const active = href && (href === '/' ? pathname === '/' : pathname.startsWith(href));
            const body = (
              <span className={cn('relative flex flex-col items-center gap-0.5 py-2 text-[11px]', active ? 'text-accent' : 'text-primary')}>
                <Icon size={20} />{label}
                {badge > 0 && <span className="absolute right-[26%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-highlight px-1 text-[9px] font-bold text-white">{badge}</span>}
              </span>
            );
            return <li key={label}>{href ? <Link href={href}>{body}</Link> : <button className="w-full" onClick={onClick}>{body}</button>}</li>;
          })}
        </ul>
      </nav>

      <FullMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <Drawer open={searchOpen} onClose={() => setSearchOpen(false)} title="Search" side="right" width="max-w-full">
        <div className="p-5"><SearchBar autoFocus /></div>
      </Drawer>
    </>
  );
}
