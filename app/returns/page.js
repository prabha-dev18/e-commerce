import StaticPage from '@/components/StaticPage';

export const revalidate = 300;
export const metadata = { title: 'Returns and refunds', description: '7-day returns on unopened products, and how refunds are paid.', alternates: { canonical: '/returns' } };

export default function Returns() {
  return <StaticPage slug="returns" title="Returns and refunds" updated="1 October 2026" intro="If something is not right, tell us within 7 days of delivery and we will fix it."
    sections={[
      { h: 'What can be returned', p: ['Unopened and unused products in their original packaging can be returned within 7 days of delivery.', 'Opened products can be returned only if they are damaged, leaking, expired or not what you ordered. Please share a photo when you raise the request.', 'For hygiene reasons we cannot take back opened lipsticks, mascaras, eyeliners and fragrances unless they arrive faulty.'] },
      { h: 'How to return', p: ['Log in, open Account, then My orders, choose the order and tap Return or refund. Select the items and tell us the reason. Our team replies within one working day and arranges the pickup.'] },
      { h: 'Refunds', p: ['After we receive and check the items, your refund is started. Online payments are refunded to the original payment method in 5 to 7 working days. For cash on delivery orders we refund to your bank account or UPI after you share the details.', 'If you cancel an order before it is packed, you are refunded in full automatically.'] },
      { h: 'Exchanges', p: ['You can ask for an exchange of shade or size when you raise the request, subject to stock.'] },
    ]} />;
}
