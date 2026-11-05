'use client';
import { motion } from 'framer-motion';
import SectionShell from '@/components/ui/SectionShell';
import { brands } from '@/data/home';

/** A logo wall made of type: hairline grid, each name fills with colour from the bottom on hover. */
export default function BrandMarquee() {
  return (
    <SectionShell no={8} label="Brands" title="Brands we *carry*" subtitle="Every one sourced directly, never a grey-market copy." tone="sand" align="center">
      <motion.ul initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-2 gap-px bg-primary/15 sm:grid-cols-3 lg:grid-cols-5">
        {brands.map((b) => (
          <motion.li key={b} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }} className="group relative flex h-28 items-center justify-center overflow-hidden bg-[#F8F5F0] sm:h-36">
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100" aria-hidden="true" />
            <span className="relative px-3 text-center font-serif text-2xl font-semibold italic text-primary/60 transition-colors duration-500 group-hover:text-white sm:text-3xl">{b}</span>
          </motion.li>
        ))}
      </motion.ul>
    </SectionShell>
  );
}
