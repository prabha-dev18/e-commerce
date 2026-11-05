import { Suspense } from 'react';
import ShopView from '@/components/shop/ShopView';

export const metadata = { title: 'Shop', description: 'Shop skincare, makeup, hair care, fragrance and more. Filter by skin type, concern, brand and price.' };
export default function ShopPage() {
  return <Suspense fallback={<div className="container-x py-20">Loading…</div>}><ShopView /></Suspense>;
}
