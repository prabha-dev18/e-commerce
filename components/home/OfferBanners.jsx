'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { offers } from '@/data/home';

/** Three offers as plain columns separated by hairlines. A colour wash rises from the bottom on hover. */
export default function OfferBanners() {
  return (
    <section className="border-y border-primary/15 bg-secondary/50">
      <RevealGroup className="container-x grid md:grid-cols-3 md:divide-x md:divide-primary/15">
        {offers.map((o, i) => (
          <RevealItem key={o.title} className="border-b border-primary/15 last:border-0 md:border-0">
            <Link href={o.href} data-cursor="View" className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden px-0 py-8 md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-secondary/70 transition-transform duration-500 ease-out group-hover:scale-y-100" aria-hidden="true" />
              <span className="label-sm relative text-accent">0{i + 1}</span>
              <div className="relative">
                <h3 className="font-serif text-3xl sm:text-4xl">{o.title}</h3>
                <p className="mt-2 text-sm">{o.text}</p>
              </div>
              <span className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-primary">{o.cta}<ArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1" /></span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
