import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductVisual from '@/components/product/ProductVisual';
import RichText from '@/components/ui/RichText';
import Button from '@/components/ui/Button';
import { loadPost, loadPosts } from '@/lib/blogSource';
import { blogPosts } from '@/data/blog';

export const revalidate = 300;
const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
export function generateStaticParams() { return blogPosts.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }) {
  const p = await loadPost(params.slug);
  if (!p) return { title: 'Article not found' };
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: 'article', title: p.title, description: p.excerpt, publishedTime: p.date, images: p.image ? [p.image] : [] } };
}

export default async function Article({ params }) {
  const [p, all] = await Promise.all([loadPost(params.slug), loadPosts()]);
  if (!p) notFound();
  const more = all.filter((x) => x.slug !== p.slug).slice(0, 2);
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.excerpt, image: p.image ? [p.image] : undefined, datePublished: p.date, author: { '@type': 'Organization', name: 'Lumière' }, publisher: { '@type': 'Organization', name: 'Lumière' }, mainEntityOfPage: `${site}/blog/${p.slug}` },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', site], ['Beauty journal', `${site}/blog`], [p.title, `${site}/blog/${p.slug}`]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) },
  ];
  return (
    <article className="container-x max-w-3xl py-12">
      {ld.map((o, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />)}
      <nav aria-label="Breadcrumb" className="mb-5 text-xs"><Link href="/" className="hover:text-primary">Home</Link> / <Link href="/blog" className="hover:text-primary">Beauty journal</Link></nav>
      <h1 className="text-3xl leading-tight sm:text-5xl">{p.title}</h1>
      <p className="mt-3 text-sm">{fmt(p.date)} · {p.readTime}</p>
      <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl"><ProductVisual src={p.image} tone={p.tone} alt={p.title} priority /></div>
      <div className="mt-10"><RichText text={p.body} /></div>
      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-secondary pt-6"><span className="text-sm">Share:</span>
        <a href={`https://wa.me/?text=${encodeURIComponent(`${p.title} ${site}/blog/${p.slug}`)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-secondary px-4 py-2 text-xs text-primary hover:bg-accent hover:text-white">WhatsApp</a>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}&url=${encodeURIComponent(`${site}/blog/${p.slug}`)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-secondary px-4 py-2 text-xs text-primary hover:bg-accent hover:text-white">Twitter</a>
        <Button href="/shop" size="sm" className="ml-auto">Shop the routine</Button></div>
      {more.length > 0 && <section className="mt-12"><h2 className="mb-4 text-2xl">Keep reading</h2><ul className="grid gap-4 sm:grid-cols-2">{more.map((m) => <li key={m.slug}><Link href={`/blog/${m.slug}`} className="block rounded-2xl bg-white p-5 shadow-soft hover:shadow-lift"><p className="text-xs">{fmt(m.date)}</p><p className="mt-1 font-serif text-lg text-primary">{m.title}</p></Link></li>)}</ul></section>}
    </article>
  );
}
