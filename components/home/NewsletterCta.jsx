'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Reveal from '@/components/ui/Reveal';
import MeshBackground from '@/components/motion/MeshBackground';
import SplitText from '@/components/motion/SplitText';
import Magnetic from '@/components/motion/Magnetic';
import { subscribe } from '@/lib/subscribe';

export default function NewsletterCta() {
  const [email, setEmail] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { toast.success(await subscribe(email)); setEmail(''); } catch (err) { toast.error(err.message); }
  };
  return (
    <section>
      <Reveal className="relative overflow-hidden bg-secondary px-4 py-20 text-center sm:py-28">
        <MeshBackground />
        <p className="label-sm relative text-accent">Join the circle</p>
        <SplitText as="h2" text="Get 10% off your first order" className="relative mt-4 text-4xl sm:text-6xl" />
        <p className="relative mx-auto mt-3 max-w-md text-body">Join for early access to launches and offers. Two emails a month, never more.</p>
        <form onSubmit={submit} className="relative mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address" className="h-12 flex-1 bg-white px-5 text-sm text-primary outline-none ring-1 ring-transparent focus:ring-accent" />
          <Magnetic><button className="sheen h-12 bg-gold-sheen px-7 text-sm font-semibold text-primary shadow-btn transition-all hover:-translate-y-0.5 hover:shadow-glow">Get my code</button></Magnetic>
        </form>
      </Reveal>
    </section>
  );
}
