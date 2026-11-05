import KineticMarquee from '@/components/motion/KineticMarquee';

const words = ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body', "Men's Grooming"];

/** A band of oversized outlined words that drift with your scrolling. */
export default function KineticBand() {
  return (
    <section className="mt-24 border-y border-accent/25 py-6 sm:py-8" aria-label="What we sell">
      <KineticMarquee items={words} speed={3} itemClassName="font-serif text-5xl font-semibold italic text-outline sm:text-7xl lg:text-8xl" />
    </section>
  );
}
