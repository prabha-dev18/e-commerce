'use client';
import Counter from '@/components/motion/Counter';
import ScrollWords from '@/components/motion/ScrollWords';
import Reveal from '@/components/ui/Reveal';

const facts = [
  { to: 50000, suffix: '+', label: 'Happy customers' },
  { to: 10, suffix: '', label: 'Brands we trust' },
  { to: 7, suffix: ' days', label: 'Easy returns' },
];

/** A big statement that lights up word by word as you scroll, followed by three counting numbers. */
export default function Manifesto() {
  return (
    <section className="container-x py-20 sm:py-24">
      <p className="label-sm flex items-center gap-4 text-accent"><span className="h-px w-10 bg-accent" />Our promise</p>
      <ScrollWords
        className="mt-8 max-w-5xl font-serif text-3xl font-semibold leading-[1.15] text-primary sm:text-5xl lg:text-5xl"
        text="Beauty is a ritual, not a rush. We choose authentic skincare, makeup, hair and fragrance that suits Indian skin and weather, and deliver it to your door with care."
      />
      <Reveal className="mt-16 grid gap-8 border-t border-accent/30 pt-10 sm:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label}>
            <p className="font-serif text-6xl font-semibold text-gold sm:text-7xl"><Counter to={f.to} suffix={f.suffix} /></p>
            <p className="label-sm mt-2 text-body">{f.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
