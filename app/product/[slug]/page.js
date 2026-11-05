import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';
import { catalog } from '@/lib/catalog';
import { loadProduct } from '@/lib/productSource';

export const revalidate = 60; // admin edits appear within a minute
export function generateStaticParams() { return catalog.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }) {
  const p = await loadProduct(params.slug);
  if (!p) return { title: 'Product not found' };
  return { title: p.seo?.title || p.name, description: p.seo?.description || `${p.name} by ${p.brand}. ${p.size}. Free shipping above ₹999.`, alternates: { canonical: `/product/${p.slug}` }, openGraph: { title: p.seo?.title || p.name, images: p.image ? [p.image] : [] } };
}

export default async function ProductPage({ params }) {
  const p = await loadProduct(params.slug);
  if (!p) notFound();
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, image: p.images, sku: p.sku, brand: { '@type': 'Brand', name: p.brand },
    aggregateRating: p.reviews > 0 ? { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews } : undefined,
    offers: { '@type': 'Offer', priceCurrency: 'INR', price: p.price, availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  };
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', site], ['Shop', `${site}/shop`], [p.name, `${site}/product/${p.slug}`]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([ld, crumbs]) }} />
      <ProductDetail product={p} />
    </>
  );
}
