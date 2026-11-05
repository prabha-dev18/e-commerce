'use client';
import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { ProfilePanel, OrdersPanel, AddressesPanel, ReviewsPanel, NotificationsPanel, PasswordPanel, WalletPanel } from './Panels';
import { cn } from '@/lib/utils';

const tabs = [['profile', 'Profile'], ['orders', 'My orders'], ['addresses', 'Addresses'], ['wishlist', 'Wishlist'], ['reviews', 'My reviews'], ['wallet', 'Wallet & rewards'], ['notifications', 'Notifications'], ['password', 'Password']];

function Inner() {
  const { status } = useSession();
  const router = useRouter();
  const tab = useSearchParams().get('tab') || 'profile';
  const [me, setMe] = useState(null);
  const [unread, setUnread] = useState(0);
  const refreshUnread = useCallback(() => fetch('/api/notifications').then((r) => r.json()).then((j) => setUnread(j.unread || 0)).catch(() => {}), []);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/me').then((r) => r.json()).then((j) => j.id && setMe(j)).catch(() => {});
    refreshUnread();
  }, [status, refreshUnread]);
  useEffect(() => { if (tab === 'wishlist') router.replace('/wishlist'); }, [tab, router]);

  if (!me) return <div className="container-x py-20 text-center">Loading your account…</div>;
  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl sm:text-4xl">Hello, {me.name.split(' ')[0]}</h1><p className="mt-1 text-sm">{me.email}{me.role !== 'user' && ` · ${me.role}`}</p></div>
        <div className="flex gap-3">
          {['admin', 'manager', 'support'].includes(me.role) && <Button href="/admin" variant="soft">Admin panel</Button>}
          <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>Log out</Button>
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr]">
        <nav aria-label="Account sections" className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {tabs.map(([k, l]) => (
            <Link key={k} href={`/account?tab=${k}`} scroll={false} aria-current={tab === k ? 'page' : undefined} className={cn('flex shrink-0 items-center justify-between rounded-full px-5 py-2.5 text-sm transition lg:rounded-xl', tab === k ? 'bg-primary text-white' : 'bg-white text-primary shadow-soft hover:bg-secondary')}>
              {l}{k === 'notifications' && unread > 0 && <span className="ml-2 rounded-full bg-highlight px-1.5 text-[10px] font-bold text-white">{unread}</span>}
            </Link>
          ))}
        </nav>
        <section aria-live="polite">
          {tab === 'profile' && <ProfilePanel me={me} setMe={setMe} />}
          {tab === 'orders' && <OrdersPanel me={me} />}
          {tab === 'addresses' && <AddressesPanel />}
          {tab === 'reviews' && <ReviewsPanel />}
          {tab === 'wallet' && <WalletPanel me={me} />}
          {tab === 'notifications' && <NotificationsPanel onRead={() => setUnread(0)} />}
          {tab === 'password' && <PasswordPanel />}
        </section>
      </div>
    </div>
  );
}
export default function AccountView() { return <Suspense fallback={<div className="container-x py-20 text-center">Loading…</div>}><Inner /></Suspense>; }
