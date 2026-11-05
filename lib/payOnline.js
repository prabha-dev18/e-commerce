import toast from 'react-hot-toast';

export function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    if (window.Razorpay) return resolve();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load the payment window. Check your connection and try again.'));
    document.body.appendChild(s);
  });
}

function openMockPaymentModal({ order, prefill, onPaid, onDismiss }) {
  if (typeof document === 'undefined') return;
  const overlay = document.createElement('div');
  overlay.id = 'lumiere-mock-payment-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(42,33,29,0.7);backdrop-filter:blur(4px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeIn 0.2s ease-out;';

  const amountRupees = Math.round((order.razorpay?.amount || order.total * 100) / 100);
  const formattedAmount = `₹${amountRupees.toLocaleString('en-IN')}`;

  overlay.innerHTML = `
    <div style="background:#fff;border-radius:24px;width:100%;max-width:440px;box-shadow:0 24px 60px rgba(0,0,0,0.25);overflow:hidden;font-family:sans-serif;color:#2A211D;position:relative;">
      <!-- Header -->
      <div style="background:#2A211D;color:#F8F5F0;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3 style="margin:0;font-size:18px;font-family:serif;letter-spacing:0.5px;">Lumière · Payment Gateway</h3>
          <p style="margin:4px 0 0;font-size:12px;opacity:0.8;">Order: <b>${order.number}</b></p>
        </div>
        <button id="mock-close-btn" style="background:transparent;border:0;color:#F8F5F0;font-size:22px;cursor:pointer;line-height:1;padding:4px;">&times;</button>
      </div>

      <!-- Amount Banner -->
      <div style="background:#F8F5F0;padding:16px 24px;border-bottom:1px solid #EDE3D8;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:14px;color:#756A61;">Total Payable</span>
        <span style="font-size:24px;font-weight:700;color:#2A211D;font-family:serif;">${formattedAmount}</span>
      </div>

      <!-- Payment Methods -->
      <div style="padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#B99A6B;">Select Payment Option (Test Mode)</p>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
          <div style="border:1.5px solid #2A211D;background:#FAF8F5;border-radius:12px;padding:10px;text-align:center;font-size:13px;font-weight:600;cursor:pointer;">
            💳 Card
          </div>
          <div style="border:1px solid #EDE3D8;background:#fff;border-radius:12px;padding:10px;text-align:center;font-size:13px;color:#756A61;cursor:pointer;">
            📱 UPI / QR
          </div>
          <div style="border:1px solid #EDE3D8;background:#fff;border-radius:12px;padding:10px;text-align:center;font-size:13px;color:#756A61;cursor:pointer;">
            🏦 Net Banking
          </div>
          <div style="border:1px solid #EDE3D8;background:#fff;border-radius:12px;padding:10px;text-align:center;font-size:13px;color:#756A61;cursor:pointer;">
            👛 Wallets
          </div>
        </div>

        <div style="background:#F8F5F0;border-radius:12px;padding:12px 14px;margin-bottom:20px;font-size:12px;color:#756A61;line-height:1.5;">
          <span style="display:inline-block;width:8px;height:8px;background:#4d7a52;border-radius:50%;margin-right:6px;"></span>
          <b>Demo Gateway:</b> Real Razorpay keys are not yet configured. You can simulate instant payment success below.
        </div>

        <!-- Action Buttons -->
        <button id="mock-pay-success-btn" style="width:100%;background:#2A211D;color:#F8F5F0;border:0;padding:14px;border-radius:999px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:10px;transition:opacity 0.2s;">
          Pay ${formattedAmount} (Success)
        </button>

        <button id="mock-pay-fail-btn" style="width:100%;background:transparent;border:1px solid #EDE3D8;color:#756A61;padding:10px;border-radius:999px;font-size:13px;cursor:pointer;">
          Simulate Payment Failure
        </button>
      </div>

      <!-- Security footer -->
      <div style="background:#FAF8F5;padding:10px 24px;border-top:1px solid #EDE3D8;text-align:center;font-size:11px;color:#998D83;">
        🔒 256-bit SSL Encrypted · Test Sandbox Environment
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const cleanup = () => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  };

  overlay.querySelector('#mock-close-btn').onclick = () => {
    cleanup();
    onDismiss?.();
  };

  overlay.querySelector('#mock-pay-fail-btn').onclick = () => {
    cleanup();
    toast.error('Payment cancelled or declined.');
    onDismiss?.();
  };

  const successBtn = overlay.querySelector('#mock-pay-success-btn');
  successBtn.onclick = async () => {
    successBtn.disabled = true;
    successBtn.innerText = 'Processing payment…';
    try {
      const resp = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          mock: true,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.error || 'Could not verify payment');
      cleanup();
      toast.success('Payment received successfully!');
      onPaid?.(data);
    } catch (err) {
      toast.error(err.message);
      successBtn.disabled = false;
      successBtn.innerText = `Pay ${formattedAmount} (Success)`;
    }
  };
}

/** order: { id, number, razorpay: { orderId, keyId, amount, mock } } as returned by POST /api/orders. */
export async function payOnline({ order, prefill, onPaid, onDismiss }) {
  const rz = order.razorpay;

  // If mock payment mode is active (no Razorpay credentials in environment), open mock checkout
  if (rz?.mock) {
    return openMockPaymentModal({ order, prefill, onPaid, onDismiss });
  }

  // Real Razorpay integration
  await loadRazorpay();
  const inst = new window.Razorpay({
    key: rz.keyId,
    amount: rz.amount,
    currency: 'INR',
    name: 'Lumière',
    description: `Order ${order.number}`,
    order_id: rz.orderId,
    prefill,
    theme: { color: '#2A211D' },
    handler: async (resp) => {
      try {
        const r = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id, ...resp }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || 'We could not confirm your payment. If money was deducted, it will be matched automatically.');
        onPaid?.(j);
      } catch (e) {
        toast.error(e.message);
      }
    },
    modal: { ondismiss: () => onDismiss?.() },
  });
  inst.on('payment.failed', (e) => toast.error(e?.error?.description || 'Payment failed. You can try again.'));
  inst.open();
}
