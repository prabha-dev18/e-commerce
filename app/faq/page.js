import Link from 'next/link';
import FaqList from '@/components/FaqList';

export const metadata = { title: 'FAQ', description: 'Answers about orders, delivery, payments, returns and products.', alternates: { canonical: '/faq' } };
const faqs = [
  { q: 'Are your products original?', a: 'Yes. We buy directly from the brands and every product ships sealed with a batch code and expiry date.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 2 to 5 working days and express takes 1 to 2. Enter your pincode on a product page to see the date for your area.' },
  { q: 'How much is shipping?', a: 'Free on orders of ₹999 and above. Below that it is ₹59 for standard delivery. Express delivery is ₹149.' },
  { q: 'Which payment methods do you accept?', a: 'UPI, debit and credit cards, net banking and wallets through Razorpay, and cash on delivery at most pincodes.' },
  { q: 'Can I cancel my order?', a: 'Yes, until it is packed. Go to Account, My orders and tap Cancel order. Paid orders are refunded automatically.' },
  { q: 'How do returns work?', a: 'Unopened products can be returned within 7 days of delivery. Opened products are accepted if damaged or incorrect. See our returns page for the steps.' },
  { q: 'When will I get my refund?', a: 'Online payments are refunded to the original method in 5 to 7 working days after we receive the items.' },
  { q: 'How do I track my order?', a: 'Use Account, My orders, or the Track order page with your order number and email.' },
  { q: 'How do I find my shade?', a: 'Product pages show every shade as a colour dot. If you are unsure, message us on WhatsApp with a photo in daylight and we will suggest one.' },
  { q: 'Is the Lumière Circle free to join?', a: 'Yes. Create an account and you earn a point for every ₹10 you spend, added after your order is delivered.' },
];
export default function Faq() {
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return (
    <div className="container-x max-w-3xl py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h1 className="text-3xl sm:text-5xl">Frequently asked questions</h1>
      <span className="mt-4 mb-8 block h-px w-14 bg-accent" />
      <FaqList items={faqs} />
      <p className="mt-8 text-sm">Still need help? <Link href="/contact" className="font-medium text-primary underline">Contact us</Link>.</p>
    </div>
  );
}
