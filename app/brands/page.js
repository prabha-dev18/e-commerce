import Link from 'next/link';
import { facets, catalog } from '@/lib/catalog';

export const metadata = { title: 'Brands', description: 'All brands we carry.' };
export default function Brands() {
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl sm:text-4xl">Brands</h1>
      <p className="mt-2">Every brand ships directly to us, so what you get is original.</p>
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {facets.brand.map(([b]) => (
          <li key={b}><Link href={`/shop?brand=${encodeURIComponent(b)}`} className="flex min-h-[110px] flex-col items-center justify-center rounded-2xl bg-white p-4 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
            <span className="font-serif text-xl text-primary">{b}</span><span className="mt-1 text-xs">{catalog.filter((p) => p.brand === b).length} products</span>
          </Link></li>
        ))}
      </ul>
    </div>
  );
}
