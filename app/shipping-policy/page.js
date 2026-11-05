import StaticPage from '@/components/StaticPage';

export const revalidate = 300;
export const metadata = { title: 'Shipping policy', description: 'Delivery times, shipping charges and how to track your order.', alternates: { canonical: '/shipping-policy' } };

export default function Shipping() {
  return <StaticPage slug="shipping-policy" title="Shipping policy" updated="1 October 2026" intro="We deliver across India. Here is what to expect."
    sections={[
      { h: 'Delivery time', p: ['Orders are packed and handed to the courier within 24 hours. Standard delivery takes 2 to 5 working days and express delivery takes 1 to 2 working days to most cities. Remote areas can take longer.', 'Enter your pincode on any product page to see the estimated delivery date.'] },
      { h: 'Shipping charges', p: ['Standard delivery is free on orders of ₹999 and above, and ₹59 below that. Express delivery is ₹149.'] },
      { h: 'Tracking', p: ['You get an email when your order ships. You can follow it from Account, My orders, or on the Track order page using your order number and email.'] },
      { h: 'Cash on delivery', p: ['Cash on delivery is available at most pincodes. Please keep the exact amount ready.'] },
      { h: 'Delivery problems', p: ['If your parcel is delayed, damaged or missing, write to care@lumiere.in with your order number and we will sort it out.'] },
    ]} />;
}
