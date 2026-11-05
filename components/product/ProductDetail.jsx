'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Share2, GitCompareArrows, Minus, Plus, ChevronRight, Truck, RotateCcw, BadgeCheck, ShieldCheck, Tag, Copy, MapPin, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import Gallery from './Gallery';
import ReviewsSection from './ReviewsSection';
import { QA, FrequentlyBought, Related, RecentlyViewed } from './ProductExtras';
import Rating from '@/components/ui/Rating';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import useHydrated from '@/hooks/useHydrated';
import { details, discountOf, facets } from '@/lib/catalog';
import { flyToCart } from '@/lib/fly';
import { formatPrice, cn } from '@/lib/utils';

const tabs = [['description', 'Description'], ['ingredients', 'Ingredients'], ['how', 'How to use'], ['benefits', 'Benefits'], ['shipping', 'Shipping & returns'], ['reviews', 'Reviews']];
const coupons = [['WELCOME10', '10% off your first order'], ['GLOW200', '₹200 off above ₹1,999'], ['UPI50', '₹50 off on UPI payments']];

export default function ProductDetail({ product: p }) {
  const router = useRouter();
  const ready = useHydrated();
  const d = details(p);
  const { addToCart, toggleWishlist, toggleCompare, pushRecent } = useStore();
  const wished = useStore((s) => s.wishlist.includes(p.id));
  const compared = useStore((s) => s.compare.includes(p.id));
  const [shade, setShade] = useState(0);
  const [size, setSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [pin, setPin] = useState('');
  const [pinMsg, setPinMsg] = useState(null);
  const [sticky, setSticky] = useState(false);
  const addBtn = useRef(null);
  const off = discountOf(p);
  const price = d.sizes[size].price;
  const out = p.stock === 0;
  const variant = [p.swatches ? `Shade ${shade + 1}` : null, size ? d.sizes[size].label : null].filter(Boolean).join(', ') || null;

  useEffect(() => { if (ready) pushRecent(p.id); }, [ready, p.id, pushRecent]);
  useEffect(() => {
    const el = addBtn.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el); return () => io.disconnect();
  }, []);

  const add = () => { flyToCart(addBtn.current); addToCart({ id: p.id, slug: p.slug, name: p.name, price }, qty, variant); toast.success('Added to your bag'); };
  const buyNow = () => { addToCart({ id: p.id, slug: p.slug, name: p.name, price }, qty, variant); useStore.getState().setCartOpen(false); router.push('/checkout'); };
  const share = async () => {
    const url = window.location.href;
    try { if (navigator.share) await navigator.share({ title: p.name, url }); else { await navigator.clipboard.writeText(url); toast.success('Link copied'); } } catch {}
  };
  const checkPin = async (e) => {
    e.preventDefault();
    if (!/^[1-8]\d{5}$/.test(pin)) return setPinMsg({ ok: false, t: 'Enter a valid 6-digit pincode.' });
    try {
      const r = await fetch(`/api/pincode?code=${pin}`);
      const j = await r.json();
      setPinMsg({ ok: !!j.serviceable, t: j.message });
    } catch {
      const f = (n) => new Date(Date.now() + n * 864e5).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      setPinMsg({ ok: true, t: `Delivery by ${f(3)} to ${f(5)}. Cash on delivery available.` });
    }
  };

  return (
    <div className="container-x py-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-xs">
        <Link href="/" className="hover:text-primary">Home</Link><ChevronRight size={12} />
        <Link href={`/shop?category=${p.category}`} className="capitalize hover:text-primary">{facets.category.find(([v]) => v === p.category)?.[1]}</Link><ChevronRight size={12} />
        <span className="text-primary">{p.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <Gallery images={p.images} name={p.name} tone={p.tone} />
        <div>
          <div className="flex gap-2">{off > 0 && <Badge tone="sale">{off}% off</Badge>}{p.badge && <Badge tone={p.badge === 'New' ? 'new' : 'gold'}>{p.badge}</Badge>}</div>
          <Link href={`/shop?brand=${encodeURIComponent(p.brand)}`} className="label-sm mt-3 block text-accent">{p.brand}</Link>
          <h1 className="mt-1 text-3xl sm:text-4xl">{p.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <button onClick={() => { setTab('reviews'); document.getElementById('tabs')?.scrollIntoView({ behavior: 'smooth' }); }}><Rating value={p.rating} count={`${p.reviews} reviews`} /></button>
            <span>SKU: {p.sku}</span>
            <span className={out ? 'text-highlight' : p.stock < 10 ? 'text-highlight' : 'text-[#4d7a52]'}>{out ? 'Out of stock' : p.stock < 10 ? `Only ${p.stock} left` : 'In stock'}</span>
          </div>
          <p className="mt-5 flex items-baseline gap-3 text-primary"><span className="font-serif text-4xl">{formatPrice(price)}</span>{off > 0 && !size && <><span className="line-through">{formatPrice(p.mrp)}</span><span className="text-sm text-highlight">You save {formatPrice(p.mrp - p.price)}</span></>}</p>
          <p className="text-xs">Inclusive of all taxes</p>

          {p.swatches && (
            <div className="mt-6"><p className="mb-2 text-sm text-primary">Shade: <b>{shade + 1} of {p.swatches.length}</b></p>
              <div className="flex gap-3">{p.swatches.map((c, i) => <button key={c} aria-label={`Shade ${i + 1}`} aria-pressed={shade === i} onClick={() => setShade(i)} className={cn('h-9 w-9 rounded-full ring-offset-2 transition', shade === i ? 'ring-2 ring-primary' : 'ring-1 ring-secondary')} style={{ background: c }} />)}</div>
            </div>
          )}
          <div className="mt-6"><p className="mb-2 text-sm text-primary">Size</p>
            <div className="flex flex-wrap gap-2">{d.sizes.map((s, i) => <button key={s.label} aria-pressed={size === i} onClick={() => setSize(i)} className={cn('rounded-full px-4 py-2 text-sm transition', size === i ? 'bg-primary text-white' : 'bg-secondary text-primary hover:bg-accent/30')}>{s.label}</button>)}</div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-accent/40 bg-white">
              <button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} className="p-3"><Minus size={16} /></button>
              <span className="w-8 text-center text-primary" aria-live="polite">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty(Math.min(10, qty + 1))} className="p-3"><Plus size={16} /></button>
            </div>
            <Button ref={addBtn} size="lg" disabled={out} onClick={add} className="flex-1 sm:flex-none sm:min-w-[170px]"><ShoppingBag size={18} /> Add to bag</Button>
            <Button size="lg" variant="outline" disabled={out} onClick={buyNow}>Buy now</Button>
          </div>
          <div className="mt-4 flex gap-5 text-sm text-primary">
            <button onClick={() => toggleWishlist(p.id)} aria-pressed={wished} className="flex items-center gap-1.5 hover:text-accent"><Heart size={17} className={cn(wished && 'fill-highlight text-highlight')} /> {wished ? 'Wishlisted' : 'Wishlist'}</button>
            <button onClick={() => toggleCompare(p.id)} aria-pressed={compared} className="flex items-center gap-1.5 hover:text-accent"><GitCompareArrows size={17} className={cn(compared && 'text-accent')} /> {compared ? 'In compare' : 'Compare'}</button>
            <button onClick={share} className="flex items-center gap-1.5 hover:text-accent"><Share2 size={17} /> Share</button>
          </div>

          <form onSubmit={checkPin} className="mt-7 rounded-2xl bg-white p-5 shadow-soft">
            <p className="flex items-center gap-2 text-sm font-medium text-primary"><MapPin size={16} className="text-accent" /> Check delivery</p>
            <div className="mt-3 flex gap-2">
              <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="Enter pincode" aria-label="Pincode" className="h-10 flex-1 rounded-full bg-background px-4 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent" />
              <Button type="submit" size="sm" variant="soft">Check</Button>
            </div>
            {pinMsg && <p className={cn('mt-2 text-sm', pinMsg.ok ? 'text-[#4d7a52]' : 'text-highlight')} role="status">{pinMsg.t}</p>}
          </form>

          <div className="mt-4 rounded-2xl border border-dashed border-accent/60 p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-primary"><Tag size={16} className="text-accent" /> Offers for you</p>
            <ul className="mt-3 space-y-2">{coupons.map(([c, t]) => (
              <li key={c} className="flex items-center justify-between gap-3 text-sm"><span><b className="text-primary">{c}</b> · {t}</span>
                <button aria-label={`Copy ${c}`} onClick={() => { navigator.clipboard?.writeText(c); toast.success(`${c} copied`); }} className="rounded-full p-2 hover:bg-secondary"><Copy size={14} /></button></li>
            ))}</ul>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            {[[Truck, 'Free shipping above ₹999'], [RotateCcw, '7-day easy returns'], [BadgeCheck, '100% authentic'], [ShieldCheck, 'Secure payments']].map(([Icon, t]) => <li key={t} className="flex flex-col items-center gap-1.5 text-center"><Icon size={22} className="text-accent" />{t}</li>)}
          </ul>
        </div>
      </div>

      <div id="tabs" className="mt-16 scroll-mt-36">
        <div role="tablist" className="flex gap-6 overflow-x-auto border-b border-secondary">
          {tabs.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn('relative shrink-0 pb-3 text-sm font-medium', tab === k ? 'text-primary' : 'text-body hover:text-primary')}>
              {l}{tab === k && <motion.span layoutId="pdp-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />}
            </button>
          ))}
        </div>
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="py-8" role="tabpanel">
          {tab === 'description' && <p className="max-w-3xl leading-relaxed">{d.description}</p>}
          {tab === 'ingredients' && <p className="max-w-3xl leading-relaxed">{d.ingredients}</p>}
          {tab === 'how' && <p className="max-w-3xl leading-relaxed">{d.howTo}</p>}
          {tab === 'benefits' && <ul className="max-w-3xl list-disc space-y-2 pl-5">{d.benefits.map((b) => <li key={b}>{b}</li>)}</ul>}
          {tab === 'shipping' && <div className="max-w-3xl space-y-3 leading-relaxed"><p>Orders ship within 24 hours and arrive in 2 to 5 days. Shipping is free above ₹999, otherwise ₹59.</p><p>Unopened products can be returned within 7 days of delivery for a refund to the original payment method. Opened products are eligible only if damaged or incorrect.</p></div>}
          {tab === 'reviews' && <ReviewsSection product={p} />}
        </motion.div>
      </div>

      <div className="mt-8 space-y-16"><QA product={p} /><FrequentlyBought product={p} /><Related product={p} />{ready && <RecentlyViewed product={p} />}</div>

      <div className={cn('fixed inset-x-0 bottom-[60px] z-40 flex items-center gap-3 border-t border-accent/20 bg-white/95 p-3 backdrop-blur transition-transform md:hidden', sticky ? 'translate-y-0' : 'translate-y-[200%]')}>
        <div className="min-w-0 flex-1"><p className="truncate text-sm text-primary">{p.name}</p><p className="font-serif text-lg text-primary">{formatPrice(price * qty)}</p></div>
        <Button disabled={out} onClick={add}>Add to bag</Button>
      </div>
    </div>
  );
}
