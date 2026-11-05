'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/motion/Magnetic';
import SplitText from '@/components/motion/SplitText';
import MeshBackground from '@/components/motion/MeshBackground';
import { subscribe } from '@/lib/subscribe';

/** Members offer and newsletter share one dark band, side by side. Either half can be switched off from the admin. */
export default function CircleBand({ showPromo = true, showNewsletter = true }) {
  const [email, setEmail] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { toast.success(await subscribe(email)); setEmail(''); } catch (err) { toast.error(err.message); }
  };
  if (!showPromo && !showNewsletter) return null;
  const both = showPromo && showNewsletter;
  return (
    <section className="relative overflow-hidden bg-primary text-secondary">
      <MeshBackground dark />
      <div className={`container-x relative grid gap-10 py-14 lg:py-16 ${both ? 'md:grid-cols-2 md:divide-x md:divide-white/15' : 'text-center'}`}>
        {showPromo && (
          <div className={both ? 'md:pr-10' : 'mx-auto max-w-xl'}>
            <p className="label-sm text-gold">Members only</p>
            <SplitText as="h2" text="Earn a point on every ₹10 you spend" className="mt-3 text-2xl !text-white sm:text-3xl" />
            <p className="mt-3 max-w-md text-sm text-secondary/80">Points turn into discounts on your next order. Joining takes a minute.</p>
            <Magnetic className="mt-6"><Button href="/account" variant="soft" data-cursor="Join">Join Lumière Circle</Button></Magnetic>
          </div>
        )}
        {showNewsletter && (
          <div className={both ? 'md:pl-10' : 'mx-auto max-w-xl'}>
            <p className="label-sm text-gold">Join the circle</p>
            <SplitText as="h2" text="Get 10% off your first order" className="mt-3 text-2xl !text-white sm:text-3xl" />
            <p className="mt-3 max-w-md text-sm text-secondary/80">Early access to launches and offers. Two emails a month, never more.</p>
            <form onSubmit={submit} className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address" className="h-12 flex-1 bg-white px-5 text-sm text-primary outline-none ring-1 ring-transparent focus:ring-accent" />
              <Magnetic><button className="h-12 bg-gold-sheen px-7 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5">Get my code</button></Magnetic>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
