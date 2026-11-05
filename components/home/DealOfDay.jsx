'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import ProductVisual from '@/components/product/ProductVisual';
import Reveal from '@/components/ui/Reveal';
import MaskImage from '@/components/motion/MaskImage';
import Magnetic from '@/components/motion/Magnetic';
import Spotlight from '@/components/motion/Spotlight';
import { useStore } from '@/store/useStore';
import { products } from '@/data/home';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const deal = { ...products[0], dealPrice: 699, sold: 74, total: 100 };
const pad = (n) => String(n).padStart(2, '0');

function useCountdown() {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => { const end = new Date(); end.setHours(23, 59, 59, 999); setLeft(Math.max(end - new Date(), 0)); };
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t);
  }, []);
  if (left == null) return ['--', '--', '--'];
  return [pad(Math.floor(left / 3.6e6)), pad(Math.floor(left / 6e4) % 60), pad(Math.floor(left / 1e3) % 60)];
}

export default function DealOfDay() {
  const [h, m, s] = useCountdown();
  const addToCart = useStore((st) => st.addToCart);
  const pct = (deal.sold / deal.total) * 100;
  return (
    <section className="bg-primary py-16 lg:py-24">
      <Spotlight color="rgba(185,154,107,0.18)"><Reveal className="container-x relative grid overflow-hidden text-secondary md:grid-cols-2">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
        <MaskImage direction="left" className="relative min-h-[320px]"><ProductVisual src={deal.image} alt={deal.name} tone={deal.tone} /><span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-primary/50 max-md:hidden" aria-hidden="true" /></MaskImage>
        <div className="relative z-[2] py-12 sm:py-20 md:pl-14">
          <p className="label-sm text-gold">Deal of the day</p>
          <h2 className="mt-3 text-3xl !text-white sm:text-4xl">{deal.name}</h2>
          <p className="mt-3 text-sm text-secondary/80">Brightens uneven tone in three weeks. Today only, while stock lasts.</p>
          <p className="mt-5 text-3xl text-white">{formatPrice(deal.dealPrice)} <span className="ml-2 text-base text-secondary/60 line-through">{formatPrice(deal.mrp)}</span></p>
          <div className="mt-6 flex gap-3" role="timer" aria-label="Time left">
            {[[h, 'Hours'], [m, 'Mins'], [s, 'Secs']].map(([v, l]) => (
              <div key={l} className="w-[76px] border border-white/20 py-3 text-center"><p className="font-serif text-2xl text-white tabular-nums">{v}</p><p className="text-[11px]">{l}</p></div>
            ))}
          </div>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs"><span>{deal.sold} sold</span><span>{deal.total - deal.sold} left</span></div>
            <div className="h-px overflow-hidden bg-white/20"><motion.div className="h-full bg-gold-sheen" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.2 }} /></div>
          </div>
          <Magnetic className="mt-8 inline-block"><Button size="lg" onClick={() => { addToCart({ id: deal.id, name: deal.name, price: deal.dealPrice }); toast.success('Deal added to your bag'); }}>Add to bag</Button></Magnetic>
        </div>
      </Reveal></Spotlight>
    </section>
  );
}
