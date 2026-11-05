import Link from 'next/link';
import ProductVisual from '@/components/product/ProductVisual';
import { loadPosts } from '@/lib/blogSource';

export const revalidate = 300;
export const metadata = { title: 'Beauty journal', description: 'Skincare routines, shade guides and ingredient explainers from the Lumière team.', alternates: { canonical: '/blog' } };
const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function Blog() {
  const posts = await loadPosts();
  return (
    <div className="container-x py-12">
      <h1 className="text-3xl sm:text-5xl">Beauty journal</h1>
      <span className="mt-4 mb-2 block h-px w-14 bg-accent" />
      <p className="mb-10">Routines, shade guides and ingredient explainers.</p>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group block h-full overflow-hidden rounded-2xl bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
              <div className="aspect-[16/10] overflow-hidden"><div className="h-full transition-transform duration-700 group-hover:scale-105"><ProductVisual src={p.image} tone={p.tone} alt={p.title} priority={i === 0} /></div></div>
              <div className="p-5"><p className="text-xs">{fmt(p.date)} · {p.readTime}</p><h2 className="mt-2 text-xl leading-snug group-hover:text-accent">{p.title}</h2><p className="mt-2 line-clamp-3 text-sm">{p.excerpt}</p></div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
