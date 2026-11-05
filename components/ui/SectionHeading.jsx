'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SplitText from '@/components/motion/SplitText';
import { cn } from '@/lib/utils';

/** Editorial section heading: eyebrow with a drawing rule, split-text title, soft subtitle. */
export default function SectionHeading({ title, subtitle, eyebrow, href, linkLabel = 'View all', align = 'left', className }) {
  const center = align === 'center';
  return (
    <div className={cn('mb-10 flex items-end justify-between gap-6 lg:mb-14', center && 'flex-col items-center text-center', className)}>
      <div className={center ? 'flex flex-col items-center' : undefined}>
        {eyebrow && (
          <p className="label-sm mb-4 flex items-center gap-4 text-accent">
            <motion.span className="h-px w-10 origin-left bg-accent" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
            {eyebrow}
          </p>
        )}
        <SplitText as="h2" text={title} className="text-4xl leading-[1.05] sm:text-4xl lg:text-5xl" />
        {subtitle && <motion.p className="mt-4 max-w-xl text-sm sm:text-base" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.7 }}>{subtitle}</motion.p>}
      </div>
      {href && !center && <Link href={href} className="nav-link shrink-0" data-cursor="Open">{linkLabel}</Link>}
    </div>
  );
}
