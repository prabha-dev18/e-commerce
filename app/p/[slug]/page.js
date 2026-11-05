import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Page from '@/models/Page';
import RichText from '@/components/ui/RichText';

export const revalidate = 60;
async function load(slug) {
  try { await connectDB(); const p = await Page.findOne({ slug, published: true }).lean(); return p ? { title: p.title, body: p.body || '' } : null; } catch { return null; }
}
export async function generateMetadata({ params }) { const p = await load(params.slug); return { title: p?.title || 'Page' }; }

// Content is rendered as plain text paragraphs (no HTML), so editors cannot inject scripts.
export default async function CmsPage({ params }) {
  const p = await load(params.slug);
  if (!p) notFound();
  return (
    <article className="container-x max-w-3xl py-12">
      <h1 className="text-3xl sm:text-5xl">{p.title}</h1>
      <span className="mt-4 block h-px w-14 bg-accent" />
      <div className="mt-8"><RichText text={p.body} /></div>
    </article>
  );
}
