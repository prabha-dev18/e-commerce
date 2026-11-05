'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SplitText from '@/components/motion/SplitText';
import { cn } from '@/lib/utils';

const bands = { light: '', sand: 'bg-secondary/50', dark: 'bg-primary text-secondary' };

/**
 * The frame every home section sits in. Same type scale, rule and spacing everywhere, two heading layouts:
 * align="split"  - numbered label on the left, large title on the right
 * align="center" - centred title with a small ornament
 * Wrap a word in *asterisks* in the title to set it in gold italics.
 */
export default function SectionShell({ no, label, title, subtitle, href, linkLabel = 'View all', tone = 'light', align = 'split', className, children }) {
  const dark = tone === 'dark';
  const rule = <motion.span className={cn('absolute left-0 top-0 h-px w-full origin-left', dark ? 'bg-white/25' : 'bg-primary/20')} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} />;
  const link = href && <Link href={href} data-cursor="Open" className={cn('nav-link shrink-0', dark && '!text-white')}>{linkLabel}</Link>;
  return (
    <section className={cn('py-16 lg:py-24', bands[tone], className)} aria-label={label || title}>
      <div className="container-x">
        {align === 'center' ? (
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-sm text-accent">{label}</p>
            <SplitText as="h2" text={title} className={cn('mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl', dark && '!text-white')} />
            <span className="mx-auto mt-6 flex w-fit items-center gap-3" aria-hidden="true"><span className="h-px w-12 bg-accent/60" /><span className="h-1.5 w-1.5 rotate-45 bg-accent" /><span className="h-px w-12 bg-accent/60" /></span>
            {subtitle && <p className={cn('mt-5 text-sm sm:text-base', dark && 'text-secondary/80')}>{subtitle}</p>}
            {href && <div className="mt-4">{link}</div>}
          </div>
        ) : (
          <div className="relative grid items-start gap-4 pt-8 lg:grid-cols-12 lg:gap-10">
            {rule}
            <div className="lg:col-span-3 lg:pt-3">
              <p className="label-sm text-accent">{no != null ? `No. ${String(no).padStart(2, '0')}` : ''}</p>
              <p className={cn('mt-1 text-xs uppercase tracking-[0.2em]', dark ? 'text-secondary/70' : 'text-body')}>{label}</p>
            </div>
            <div className="lg:col-span-9">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SplitText as="h2" text={title} className={cn('max-w-3xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl', dark && '!text-white')} />
                {link}
              </div>
              {subtitle && <p className={cn('mt-3 max-w-xl text-sm sm:text-base', dark && 'text-secondary/80')}>{subtitle}</p>}
            </div>
          </div>
        )}
        <div className="mt-10 lg:mt-14">{children}</div>
      </div>
    </section>
  );
}
