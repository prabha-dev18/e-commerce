'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, ShoppingBag, Package, Tags, Award, Users, Star, RotateCcw, Ticket, Image as ImageIcon, FileText, File, Mail, MessageSquare, Settings, Menu, Store } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';
import { ADMIN_NAV, can } from '@/lib/permissions';
import { cn } from '@/lib/utils';

const icons = { dashboard: LayoutDashboard, orders: ShoppingBag, products: Package, categories: Tags, brands: Award, customers: Users, reviews: Star, returns: RotateCcw, coupons: Ticket, banners: ImageIcon, blog: FileText, pages: File, newsletter: Mail, messages: MessageSquare, settings: Settings };

export default function AdminShell({ children }) {
  const { data, status } = useSession();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const role = data?.user?.role;
  const items = ADMIN_NAV.filter(([k]) => can(role, k));
  const current = [...ADMIN_NAV].sort((a, b) => b[2].length - a[2].length).find(([, , h]) => (h === '/admin' ? path === '/admin' : path.startsWith(h)));
  const allowed = !current || can(role, current[0]);

  const nav = (
    <nav className="space-y-1 p-3" aria-label="Admin sections">
      {items.map(([k, label, href]) => { const Icon = icons[k]; const on = current?.[0] === k; return (
        <Link key={k} href={href} onClick={() => setOpen(false)} aria-current={on ? 'page' : undefined} className={cn('flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition', on ? 'bg-primary text-white' : 'text-primary hover:bg-secondary')}><Icon size={17} />{label}</Link>
      ); })}
    </nav>
  );
  if (status === 'loading') return <div className="p-20 text-center">Loading…</div>;
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-accent/20 bg-white px-4">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-full p-2 hover:bg-secondary lg:hidden"><Menu size={20} /></button>
        <Link href="/admin" className="font-serif text-xl text-primary">Lumière <span className="text-xs font-sans text-accent">Admin</span></Link>
        <span className="ml-auto text-xs capitalize">{data?.user?.name} · {role}</span>
        <Link href="/" className="flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2 text-xs text-primary hover:bg-accent hover:text-white"><Store size={14} /> View store</Link>
      </header>
      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-accent/20 bg-white lg:block">{nav}</aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {allowed ? children : <div className={`${'rounded-2xl bg-white shadow-soft'} p-12 text-center`}><h1 className="text-2xl">No access</h1><p className="mt-2 text-sm">Your role ({role}) cannot open this section. Ask an admin if you need it.</p></div>}
        </main>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} title="Menu" side="left" width="max-w-xs">{nav}</Drawer>
    </div>
  );
}
