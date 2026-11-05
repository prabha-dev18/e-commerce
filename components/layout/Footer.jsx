'use client';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Instagram, Facebook, Youtube, Twitter, Phone, Mail, MapPin, ShieldCheck, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { SITE_NAME } from '@/lib/utils';
import { subscribe } from '@/lib/subscribe';

const cols = [
  { title: 'Shop', links: [['Skincare', '/shop?category=skincare'], ['Makeup', '/shop?category=makeup'], ['Hair', '/shop?category=hair'], ['Fragrance', '/shop?category=fragrance'], ['Bath & Body', '/shop?category=bath-body'], ['Gift Sets', '/shop?category=gift-sets']] },
  { title: 'Customer service', links: [['Track order', '/track-order'], ['Shipping policy', '/shipping-policy'], ['Returns & refunds', '/returns'], ['FAQ', '/faq'], ['Contact us', '/contact']] },
  { title: 'Company', links: [['About us', '/about'], ['Beauty journal', '/blog'], ['Store locator', '/stores'], ['Privacy policy', '/privacy'], ['Terms of use', '/terms']] },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const onSubscribe = async (e) => {
    e.preventDefault();
    try { toast.success(await subscribe(email)); setEmail(''); } catch (err) { toast.error(err.message); }
  };
  return (
    <footer className="relative overflow-hidden bg-primary text-secondary max-md:pb-16">
      <div className="gold-hairline" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <div className="container-x relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="font-serif text-4xl font-bold text-white">{SITE_NAME}<span className="text-gold">.</span></Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-secondary/80">Authentic skincare, makeup, hair and fragrance from brands we trust, delivered across India in 2 to 5 days.</p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2"><MapPin size={15} className="text-accent" /> 12 Ashram Road, Ahmedabad 380009</li>
            <li className="flex items-center gap-2"><Phone size={15} className="text-accent" /> +91 99999 99999</li>
            <li className="flex items-center gap-2"><Mail size={15} className="text-accent" /> care@lumiere.in</li>
          </ul>
          <div className="mt-5 flex gap-3">
            {[[Instagram, 'Instagram'], [Facebook, 'Facebook'], [Youtube, 'YouTube'], [Twitter, 'Twitter']].map(([Icon, n]) => (
              <a key={n} href="#" aria-label={n} className="rounded-full border border-secondary/20 bg-white/5 p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-white hover:shadow-glow"><Icon size={16} /></a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="lg:col-span-2">
            <h3 className="label-sm mb-4 !font-sans text-accent">{c.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {c.links.map(([l, h]) => <li key={l}><Link href={h} className="transition-colors hover:text-accent">{l}</Link></li>)}
            </ul>
          </div>
        ))}
        <div className="md:col-span-2 lg:col-span-2">
          <h3 className="label-sm mb-4 !font-sans text-accent">Get 10% off</h3>
          <form onSubmit={onSubscribe} className="space-y-2">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" aria-label="Email address"
              className="h-11 w-full rounded-full bg-white/10 px-4 text-sm text-white placeholder:text-secondary/60 outline-none ring-1 ring-white/10 focus:ring-accent" />
            <button className="sheen h-11 w-full rounded-full bg-gold-sheen text-sm font-semibold text-primary shadow-btn transition-all hover:-translate-y-0.5 hover:shadow-glow">Subscribe</button>
          </form>
          <p className="mt-3 text-xs text-secondary/60">Offers and routines, twice a month. Unsubscribe anytime.</p>
        </div>
      </div>
      <div className="pointer-events-none select-none overflow-hidden px-2 text-center font-serif font-bold leading-[0.8] text-gold-flow" style={{ fontSize: 'clamp(5rem, 24vw, 22rem)' }} aria-hidden="true">{SITE_NAME}</div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_NAME} Cosmetics Pvt. Ltd. All rights reserved.</p>
          <ul className="flex items-center gap-4 text-secondary/80">
            <li className="flex items-center gap-1.5"><ShieldCheck size={14} /> Secure checkout</li>
            <li className="flex items-center gap-1.5"><CreditCard size={14} /> Cards</li>
            <li className="flex items-center gap-1.5"><Smartphone size={14} /> UPI</li>
            <li className="flex items-center gap-1.5"><Wallet size={14} /> Cash on delivery</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
