'use client';
import { Truck, RotateCcw, BadgeCheck, ShieldCheck, Headphones } from 'lucide-react';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';

const trust = [
  [Truck, 'Free shipping', 'Above ₹999'],
  [RotateCcw, 'Easy returns', '7 days'],
  [BadgeCheck, '100% authentic', 'Trusted brands'],
  [ShieldCheck, 'Secure payment', 'UPI, cards, COD'],
  [Headphones, 'Support', '9am to 9pm'],
];
/** A single hairline strip: no boxes, just icon and two short lines per item. */
export default function TrustRow() {
  return (
    <section className="border-y border-primary/10 bg-background">
      <RevealGroup className="container-x grid grid-cols-2 gap-y-5 py-6 md:grid-cols-5 md:divide-x md:divide-primary/10">
        {trust.map(([Icon, t, s]) => (
          <RevealItem key={t} className="flex items-center gap-3 md:justify-center">
            <Icon size={22} strokeWidth={1.4} className="text-accent" />
            <p className="text-sm leading-tight"><span className="block font-semibold text-primary">{t}</span><span className="text-xs">{s}</span></p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
