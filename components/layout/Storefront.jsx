'use client';
import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import CartDrawer from './CartDrawer';
import FloatingActions from './FloatingActions';
import CookieBanner from './CookieBanner';
import CompareBar from './CompareBar';
import Preloader from '@/components/motion/Preloader';
import CursorFollower from '@/components/motion/CursorFollower';
import ScrollProgress from '@/components/motion/ScrollProgress';

/** Shop chrome (header, footer, bag). The admin area gets a plain page instead. */
export default function Storefront({ children }) {
  const admin = usePathname()?.startsWith('/admin');
  if (admin) return children;
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:text-white">Skip to content</a>
      <Preloader />
      <ScrollProgress />
      <CursorFollower />
      <TopBar />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <FloatingActions />
      <CompareBar />
      <CookieBanner />
    </>
  );
}
