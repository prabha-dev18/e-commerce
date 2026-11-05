import StaticPage from '@/components/StaticPage';
import Button from '@/components/ui/Button';

export const revalidate = 300;
export const metadata = { title: 'About us', description: 'Who we are, how we choose products and why every item on Lumière is original.', alternates: { canonical: '/about' } };

export default function About() {
  return (
    <>
      <StaticPage slug="about" title="About Lumière" intro="We started Lumière in Ahmedabad because buying good skincare and makeup online should not mean guessing whether it is original."
        sections={[
          { h: 'What we do', p: ['Lumière is an online beauty store for skincare, makeup, hair care, fragrance and grooming. We stock a small number of brands we have tried ourselves and buy directly from them, so every product reaches you sealed with a batch code.', 'Our team reads ingredient lists, checks claims and removes products that do not hold up. If something does not work for enough customers, it leaves the shelf.'] },
          { h: 'How we choose products', p: ['We look for formulas that suit Indian skin and weather: light textures, proper sun protection and shades that cover a wide range of skin tones.', 'We label products as vegan, cruelty-free or paraben-free only when the brand can show us proof.'] },
          { h: 'Delivery and support', p: ['Orders ship within 24 hours and reach most of India in 2 to 5 days. Our support team answers on WhatsApp and email every day from 9am to 9pm.'] },
        ]} />
      <div className="container-x max-w-3xl pb-12"><Button href="/shop">Start shopping</Button> <Button href="/contact" variant="outline">Talk to us</Button></div>
    </>
  );
}
