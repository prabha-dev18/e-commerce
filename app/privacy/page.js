import StaticPage from '@/components/StaticPage';

export const revalidate = 300;
export const metadata = { title: 'Privacy policy', description: 'What personal information we collect, why, and how you can control it.', alternates: { canonical: '/privacy' } };

export default function Privacy() {
  return <StaticPage slug="privacy" title="Privacy policy" updated="1 October 2026" intro="This page explains what information Lumière collects when you use our store and what we do with it."
    sections={[
      { h: 'Information we collect', p: ['Account details: your name, email address, mobile number and password (stored only as a one-way hash).', 'Order details: delivery address, items bought, and payment status. We never see or store your card, UPI or bank details. Payments are handled by Razorpay.', 'Usage data: pages visited and your saved bag and wishlist, so the store works as expected.'] },
      { h: 'How we use it', p: ['To process and deliver orders, send order updates, provide customer support, prevent fraud, and improve the store.', 'We send marketing emails only if you subscribe, and every email has an unsubscribe link.'] },
      { h: 'Who we share it with', p: ['Delivery partners (your name, address and phone), the payment provider (order amount and payment status), and our email provider. We do not sell your personal information.'] },
      { h: 'Cookies', p: ['We use cookies and local storage to keep you signed in and to remember your bag. You can clear them in your browser at any time.'] },
      { h: 'Your choices', p: ['You can update your details in your account, unsubscribe from emails, or ask us to delete your account by writing to care@lumiere.in. We may keep order records for as long as the law requires.'] },
      { h: 'Contact', p: ['Questions about privacy: care@lumiere.in.'] },
    ]} />;
}
