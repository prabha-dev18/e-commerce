import Link from 'next/link';
import RichText from '@/components/ui/RichText';
import { loadCms } from '@/lib/cms';

/** Built-in page content, replaced automatically if an admin creates a page with the same slug (Admin, Pages). */
export default async function StaticPage({ slug, title, intro, sections, updated }) {
  const cms = await loadCms(slug);
  return (
    <article className="container-x max-w-3xl py-12">
      <nav aria-label="Breadcrumb" className="mb-5 text-xs"><Link href="/" className="hover:text-primary">Home</Link> / <span className="text-primary">{cms?.title || title}</span></nav>
      <h1 className="text-3xl sm:text-5xl">{cms?.title || title}</h1>
      <span className="mt-4 block h-px w-14 bg-accent" />
      {cms ? <div className="mt-8"><RichText text={cms.body} /></div> : (
        <div className="mt-8 space-y-8 leading-relaxed">
          {intro && <p className="text-lg">{intro}</p>}
          {sections.map((s) => <section key={s.h}><h2 className="mb-3 text-2xl">{s.h}</h2><div className="space-y-3">{s.p.map((t, i) => <p key={i}>{t}</p>)}</div></section>)}
          {updated && <p className="text-xs">Last updated: {updated}</p>}
        </div>
      )}
    </article>
  );
}
