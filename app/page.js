import HeroCarousel from '@/components/home/HeroCarousel';
import Manifesto from '@/components/home/Manifesto';
import RitualStory from '@/components/home/RitualStory';
import TrustRow from '@/components/home/TrustRow';
import CategoryGrid from '@/components/home/CategoryGrid';
import OfferBanners from '@/components/home/OfferBanners';
import ProductTabs from '@/components/home/ProductTabs';
import DealOfDay from '@/components/home/DealOfDay';
import ConcernGrid from '@/components/home/ConcernGrid';
import TrendingGrid from '@/components/home/TrendingGrid';
import PromoParallax from '@/components/home/PromoParallax';
import BrandMarquee from '@/components/home/BrandMarquee';
import Bundles from '@/components/home/Bundles';
import Testimonials from '@/components/home/Testimonials';
import UgcGallery from '@/components/home/UgcGallery';
import BlogPreview from '@/components/home/BlogPreview';
import NewsletterCta from '@/components/home/NewsletterCta';
import connectDB from '@/lib/db';
import Banner from '@/models/Banner';
import Settings from '@/models/Settings';

export const revalidate = 60; // banner and section changes from the admin show within a minute

const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
async function loadHome() {
  try {
    await Promise.race([connectDB(), timeout(3000)]);
    const [banners, s] = await Promise.all([Banner.find({ active: true, placement: 'hero' }).sort('order').lean(), Settings.findOne({ key: 'store' }).select('homeSections').lean()]);
    const slides = banners.map((b) => ({ eyebrow: b.eyebrow || '', title: b.title, text: b.text || '', cta: b.cta || 'Shop now', href: b.href || '/shop', image: b.image, tone: b.tone || '#EDE3D8' }));
    return { slides: slides.length ? slides : undefined, sections: s?.homeSections || {} };
  } catch { return { slides: undefined, sections: {} }; }
}

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'Organization', name: 'Lumière', url: site, email: 'care@lumiere.in', telephone: '+91 99999 99999', address: { '@type': 'PostalAddress', streetAddress: '12 Ashram Road', addressLocality: 'Ahmedabad', postalCode: '380009', addressCountry: 'IN' } },
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Lumière', url: site, potentialAction: { '@type': 'SearchAction', target: `${site}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
];

export default async function Home() {
  const { slides, sections } = await loadHome();
  const on = (k) => sections[k] !== false;
  return (
    <>
      {jsonLd.map((o, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />)}
      <HeroCarousel slides={slides} />
      <TrustRow />
      <CategoryGrid />
      {on('offers') && <OfferBanners />}
      {on('tabs') && <ProductTabs />}
      {on('deal') && <DealOfDay />}
      <Manifesto />
      {on('story') && <RitualStory />}
      {on('concerns') && <ConcernGrid />}
      {on('trending') && <TrendingGrid />}
      {on('promo') && <PromoParallax />}
      {on('bundles') && <Bundles />}
      {on('brands') && <BrandMarquee />}
      {on('testimonials') && <Testimonials />}
      {on('ugc') && <UgcGallery />}
      {on('blog') && <BlogPreview />}
      {on('newsletter') && <NewsletterCta />}
    </>
  );
}
