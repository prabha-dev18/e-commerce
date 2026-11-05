import toast from 'react-hot-toast';

export function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load the payment window. Check your connection and try again.'));
    document.body.appendChild(s);
  });
}

/** order: { id, number, razorpay: { orderId, keyId, amount } } as returned by POST /api/orders. */
export async function payOnline({ order, prefill, onPaid, onDismiss }) {
  await loadRazorpay();
  const rz = order.razorpay;
  const inst = new window.Razorpay({
    key: rz.keyId, amount: rz.amount, currency: 'INR', name: 'Lumière', description: `Order ${order.number}`, order_id: rz.orderId, prefill,
    theme: { color: '#2A211D' },
    handler: async (resp) => {
      try {
        const r = await fetch('/api/payments/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: order.id, ...resp }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || 'We could not confirm your payment. If money was deducted, it will be matched automatically.');
        onPaid?.(j);
      } catch (e) { toast.error(e.message); }
    },
    modal: { ondismiss: () => onDismiss?.() },
  });
  inst.on('payment.failed', (e) => toast.error(e?.error?.description || 'Payment failed. You can try again.'));
  inst.open();
}
