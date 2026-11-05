'use client';
import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';

const colors = ['#B99A6B', '#B98282', '#2A211D', '#EDE3D8'];

export default function OrderSuccess({ searchParams }) {
  const reduce = useReducedMotion();
  const n = String(searchParams?.n || '').replace(/[^A-Z0-9-]/gi, '').slice(0, 30);
  const id = String(searchParams?.id || '').replace(/[^a-f0-9]/gi, '').slice(0, 24);
  const t = String(searchParams?.t || '').replace(/[^a-f0-9]/gi, '').slice(0, 64);
  const pstate = ['paid', 'review', 'cod'].includes(searchParams?.p) ? searchParams.p : '';
  const note = { paid: 'Payment received. Your order is confirmed and your invoice is ready.', review: 'We have your UPI reference and will confirm the payment shortly. You will get an email once it is confirmed.', cod: 'Please keep the amount ready to pay when your parcel arrives.' }[pstate] || 'We have sent a confirmation email. You can follow your parcel from your account, or with your order number and email.';
  const bits = useMemo(() => Array.from({ length: 36 }, (_, i) => ({ x: (i * 53) % 100, delay: (i % 9) * 0.08, size: 6 + (i % 4) * 3, c: colors[i % 4], r: (i * 47) % 360, d: 2.2 + (i % 5) * 0.3 })), []);
  return (
    <div className="relative overflow-hidden">
      {!reduce && <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {bits.map((b, i) => <motion.span key={i} className="absolute top-0 rounded-sm" style={{ left: `${b.x}%`, width: b.size, height: b.size * 1.6, background: b.c }} initial={{ y: -40, opacity: 1, rotate: 0 }} animate={{ y: 520, opacity: 0, rotate: b.r + 360 }} transition={{ duration: b.d, delay: b.delay, ease: 'easeIn' }} />)}
      </div>}
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}><CheckCircle2 size={72} className="text-accent" /></motion.div>
        <h1 className="text-3xl sm:text-5xl">{pstate === 'paid' ? 'Payment done. Thank you!' : 'Thank you for your order'}</h1>
        {n && <p className="text-lg text-primary">Order number: <b>{n}</b></p>}
        <p className="max-w-md">{note}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">{id && t && <Button href={`/api/orders/${id}/invoice?t=${t}&download=1`} target="_blank" rel="noopener" variant="soft"><FileText size={16} /> Download invoice</Button>}<Button href="/account?tab=orders">My orders</Button><Button href="/track-order" variant="outline">Track an order</Button><Button href="/shop" variant="ghost">Keep shopping</Button></div>
      </div>
    </div>
  );
}
