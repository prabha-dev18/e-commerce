import StaticPage from '@/components/StaticPage';

export const revalidate = 300;
export const metadata = { title: 'Terms of use', description: 'The rules for using the Lumière website and placing orders.', alternates: { canonical: '/terms' } };

export default function Terms() {
  return <StaticPage slug="terms" title="Terms of use" updated="1 October 2026" intro="By using this website or placing an order you agree to these terms."
    sections={[
      { h: 'Orders and prices', p: ['All prices are in Indian rupees and include GST. We confirm the final price when you place your order. If a price is shown wrongly, we may cancel the order and refund you in full.', 'An order is accepted when we confirm it by email. We may cancel orders we cannot fulfil, for example when an item is out of stock.'] },
      { h: 'Payment', p: ['You can pay online through Razorpay or choose cash on delivery where available. For online payments, your order is confirmed after the payment succeeds.'] },
      { h: 'Your account', p: ['Keep your password private. You are responsible for activity on your account. Tell us at once if you think someone else has used it.'] },
      { h: 'Product information', p: ['We try to keep descriptions, ingredients and images accurate. Shades can look different on different screens. Always read the label and do a patch test if you have sensitive skin.'] },
      { h: 'Reviews', p: ['Only customers who received a product can review it. We may remove reviews that are abusive, unrelated or misleading.'] },
      { h: 'Limits and changes', p: ['We are not responsible for delays caused by events outside our control. We may update these terms; the version on this page applies to orders placed after the update date.'] },
    ]} />;
}
