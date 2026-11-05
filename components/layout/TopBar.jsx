'use client';
import Link from 'next/link';
import { Phone, Mail, MapPin, Truck } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="hidden border-b border-accent/30 bg-gold-cta text-[12px] text-secondary md:block">
      <div className="container-x flex h-9 items-center justify-between">
        <p className="flex items-center gap-2"><Truck size={14} className="text-accent" /> Free shipping on orders above ₹999 · Extra 10% off your first order with <b className="text-white">WELCOME10</b></p>
        <div className="flex items-center gap-5">
          <a href="tel:+919999999999" className="flex items-center gap-1.5 hover:text-white"><Phone size={13} /> +91 99999 99999</a>
          <a href="mailto:care@lumiere.in" className="flex items-center gap-1.5 hover:text-white"><Mail size={13} /> care@lumiere.in</a>
          <Link href="/track-order" className="hover:text-white">Track order</Link>
          <Link href="/stores" className="flex items-center gap-1.5 hover:text-white"><MapPin size={13} /> Store locator</Link>
          <select aria-label="Language" className="bg-transparent text-secondary outline-none">
            <option className="text-primary">English</option><option className="text-primary">हिन्दी</option><option className="text-primary">ગુજરાતી</option>
          </select>
          <select aria-label="Currency" className="bg-transparent text-secondary outline-none">
            <option className="text-primary">INR ₹</option><option className="text-primary">USD $</option>
          </select>
        </div>
      </div>
    </div>
  );
}
