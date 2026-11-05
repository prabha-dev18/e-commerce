'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import SectionShell from '@/components/ui/SectionShell';
import ProductVisual from '@/components/product/ProductVisual';
import MaskImage from '@/components/motion/MaskImage';
import { posts } from '@/data/home';

/** Editorial journal: one large feature story beside two compact ones. */
export default function BlogPreview() {
  const [first, ...rest] = posts;
  return (
    <SectionShell no={11} label="Journal" title="From the beauty *journal*" subtitle="Routines, shade guides and ingredient explainers." href="/blog" linkLabel="Read all">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <Link href={`/blog/${first.slug}`} className="group lg:col-span-7" data-cursor="Read">
          <div className="aspect-[4/3] overflow-hidden"><MaskImage direction="up" className="h-full w-full"><div className="h-full transition-transform duration-[1200ms] group-hover:scale-105"><ProductVisual src={first.image} alt={first.title} tone={first.tone} /></div></MaskImage></div>
          <p className="label-sm mt-5 text-accent">{first.date} · {first.read}</p>
          <h3 className="mt-2 text-3xl leading-tight transition-colors group-hover:text-accent sm:text-4xl">{first.title}</h3>
        </Link>
        <div className="flex flex-col gap-8 lg:col-span-5">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group grid grid-cols-5 items-center gap-5 border-b border-primary/10 pb-8 last:border-0" data-cursor="Read">
              <div className="col-span-2 aspect-square overflow-hidden"><div className="h-full transition-transform duration-700 group-hover:scale-110"><ProductVisual src={p.image} alt={p.title} tone={p.tone} /></div></div>
              <div className="col-span-3">
                <p className="text-xs">{p.date} · {p.read}</p>
                <h3 className="mt-2 text-xl leading-snug transition-colors group-hover:text-accent">{p.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">Read <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
