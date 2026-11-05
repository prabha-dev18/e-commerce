'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionShell from '@/components/ui/SectionShell';
import Button from '@/components/ui/Button';
import ProductVisual from '@/components/product/ProductVisual';
import MaskImage from '@/components/motion/MaskImage';
import Magnetic from '@/components/motion/Magnetic';
import { useStore } from '@/store/useStore';
import { bundles } from '@/data/home';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const pct = (b) => Math.round(((b.mrp - b.price) / b.mrp) * 100);

/** One large feature set on the left, two compact ones stacked on the right. */
export default function Bundles() {
  const addToCart = useStore((s) => s.addToCart);
  const add = (b) => { addToCart({ id: b.id, name: b.name, price: b.price }); toast.success('Set added to your bag'); };
  const [big, ...rest] = bundles;
  return (
    <SectionShell no={7} label="Gifting" title="Bundles & *gift sets*" subtitle="Save up to 30% when products come as a set." href="/shop?category=gift-sets" align="center">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="group relative lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[560px]">
            <MaskImage direction="left" className="absolute inset-0"><div className="h-full w-full transition-transform duration-[1400ms] group-hover:scale-105"><ProductVisual src={big.image} alt={big.name} tone={big.tone} /></div></MaskImage>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
            <span className="absolute left-0 top-6 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">Save {pct(big)}%</span>
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 text-white sm:p-8">
              <div>
                <h3 className="font-serif text-3xl !text-white sm:text-4xl">{big.name}</h3>
                <p className="mt-1 text-sm text-white/80">{big.items}</p>
                <p className="mt-3 text-white"><span className="font-serif text-3xl">{formatPrice(big.price)}</span> <span className="ml-2 text-sm text-white/60 line-through">{formatPrice(big.mrp)}</span></p>
              </div>
              <Magnetic><Button variant="soft" onClick={() => add(big)}>Add to bag</Button></Magnetic>
            </div>
          </div>
        </div>
        <div className="grid gap-6 lg:col-span-5 lg:gap-8">
          {rest.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="group grid grid-cols-5 items-stretch gap-5 border-t border-primary/15 pt-6">
              <div className="relative col-span-2 aspect-[4/5] overflow-hidden"><div className="h-full w-full transition-transform duration-[1200ms] group-hover:scale-110"><ProductVisual src={b.image} alt={b.name} tone={b.tone} /></div></div>
              <div className="col-span-3 flex flex-col justify-between py-1">
                <div>
                  <p className="label-sm text-accent">Save {pct(b)}%</p>
                  <h3 className="mt-2 font-serif text-2xl leading-tight">{b.name}</h3>
                  <p className="mt-1 text-sm">{b.items}</p>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <p className="text-primary"><span className="font-serif text-2xl">{formatPrice(b.price)}</span><span className="ml-2 text-xs line-through">{formatPrice(b.mrp)}</span></p>
                  <Button size="sm" onClick={() => add(b)}>Add</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
