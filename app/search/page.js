import { Suspense } from 'react';
import ShopView from '@/components/shop/ShopView';

export const metadata = { title: 'Search', robots: { index: false } };
export default function SearchPage() {
  return <Suspense fallback={<div className="container-x py-20">Loading…</div>}><ShopView mode="search" /></Suspense>;
}
