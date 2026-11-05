'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CreditCard, Banknote, ShieldCheck, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import AddressFields from '@/components/AddressFields';
import Button from '@/components/ui/Button';
import ProductVisual from '@/components/product/ProductVisual';
import UpiQrModal from '@/components/checkout/UpiQrModal';
import { addressSchema } from '@/lib/validations';
import { payOnline } from '@/lib/payOnline';
import { catalog } from '@/lib/catalog';
import { useStore } from '@/store/useStore';
import useHydrated from '@/hooks/useHydrated';
import { formatPrice, shippingFor, SHIPPING_FEE, cn } from '@/lib/utils';

const steps = ['Address', 'Shipping', 'Payment', 'Review'];
const addrSchema = addressSchema.omit({ label: true, isDefault: true });
const shipOpts = [['standard', 'Standard delivery', '2 to 5 days'], ['express', 'Express delivery', '1 to 2 days']];

export default function CheckoutView() {
  const router = useRouter();
  const ready = useHydrated();
  const { status } = useSession();
  const { cart, coupon, clearCart } = useStore();
  const items = ready ? cart : [];
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState([]);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [ship, setShip] = useState('standard');
  const [pay, setPay] = useState('razorpay');
  const [gst, setGst] = useState(false);
  const [gstin, setGstin] = useState('');
  const [saveAddr, setSaveAddr] = useState(true);
  const [quote, setQuote] = useState(null);
  const [quoteErr, setQuoteErr] = useState('');
  const [placing, setPlacing] = useState(false);
  const [qrOrder, setQrOrder] = useState(null);
  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({ resolver: zodResolver(addrSchema) });
  const authed = status === 'authenticated';

  useEffect(() => { if (authed) fetch('/api/addresses').then((r) => r.json()).then((j) => { setSaved(j.items || []); const d = (j.items || [])[0]; if (d) reset(d); }).catch(() => {}); }, [authed, reset]);

  const lines = useMemo(() => items.map((i) => ({ id: i.id, qty: i.qty, variant: i.variant || null, name: i.name })), [items]);
  const local = useMemo(() => { const sub = items.reduce((n, i) => n + i.qty * i.price, 0); const d = Math.min(coupon?.discount || 0, sub); const sh = ship === 'express' ? 149 : shippingFor(sub - d); return { subtotal: sub, discount: d, shipping: sh, tax: 0, total: sub - d + sh }; }, [items, coupon, ship]);
  const q = quote || local;

  // Server-side price check; the browser's totals are only a preview.
  useEffect(() => {
    if (!ready || lines.length === 0) return;
    let off = false;
    fetch('/api/checkout/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: lines, couponCode: coupon?.code || '', shippingMethod: ship }) })
      .then(async (r) => { const j = await r.json().catch(() => ({})); if (off) return; if (r.ok) { setQuote(j); setQuoteErr(''); } else if (r.status === 409 || r.status === 400) { setQuote(null); setQuoteErr(j.error); } else { setQuote(null); setQuoteErr(''); } })
      .catch(() => !off && setQuote(null));
    return () => { off = true; };
  }, [ready, lines, coupon, ship]);

  // If card payments are not set up but QR is, start on QR; if neither, start on cash on delivery.
  useEffect(() => { if (quote && quote.cardEnabled === false && pay === 'razorpay') setPay(quote.upiEnabled ? 'upi' : 'cod'); }, [quote, pay]);

  const goSuccess = (o, p) => { clearCart(); router.push(`/order-success?n=${o.number}&id=${o.id}&t=${o.t}&p=${p}`); };
  const qrClosed = () => {
    const o = qrOrder; setQrOrder(null); setPlacing(false);
    if (!o) return;
    if (authed) { toast('Payment not completed. Your order is saved: pay from My orders.'); router.push('/account?tab=orders'); }
    else fetch('/api/payments/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: o.id }) }).then(() => toast('Payment cancelled. Your bag is still saved.')).catch(() => {});
  };

  const next0 = handleSubmit(() => {
    if (!authed && !/^\S+@\S+\.\S+$/.test(email.trim())) return setEmailErr('Enter a valid email for your order confirmation');
    setEmailErr(''); setStep(1);
  });

  const place = async () => {
    setPlacing(true);
    const address = getValues();
    try {
      const r = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: lines, couponCode: coupon?.code || '', shippingMethod: ship, paymentMethod: pay, address, email: authed ? undefined : email.trim(), gstin: gst ? gstin : '', saveAddress: authed && saveAddr }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Could not place your order');
      const done = () => goSuccess(j, pay === 'cod' ? 'cod' : 'paid');
      if (pay === 'cod') return done();
      if (pay === 'upi') { setQrOrder({ id: j.id, t: j.t, number: j.number, total: j.total }); return; }
      await payOnline({
        order: j, prefill: { name: address.name, email: authed ? undefined : email.trim(), contact: address.phone },
        onPaid: done,
        onDismiss: () => {
          if (authed) { toast('Payment not completed. Your order is saved: pay from My orders.'); router.push('/account?tab=orders'); }
          else fetch('/api/payments/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: j.id, razorpayOrderId: j.razorpay?.orderId }) }).then(() => toast('Payment cancelled. Your bag is still saved.')).catch(() => {});
          setPlacing(false);
        },
      });
    } catch (e) { toast.error(e.message); setPlacing(false); }
  };

  if (ready && items.length === 0) return (
    <div className="container-x flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center"><h1 className="text-3xl">Your bag is empty</h1><Button href="/shop">Browse products</Button></div>
  );
  const Box = ({ on, onClick, title, sub, icon: Icon }) => (
    <button type="button" onClick={onClick} aria-pressed={on} className={cn('flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition', on ? 'border-accent bg-secondary/60' : 'border-secondary bg-white hover:border-accent/60')}>
      {Icon && <Icon size={22} className="text-accent" />}<span className="flex-1"><span className="block font-medium text-primary">{title}</span><span className="text-sm">{sub}</span></span>
      <span className={cn('flex h-5 w-5 items-center justify-center rounded-full border', on ? 'border-accent bg-accent text-white' : 'border-secondary')}>{on && <Check size={12} />}</span>
    </button>
  );

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl sm:text-4xl">Checkout</h1>
      <ol className="mt-6 flex gap-2 text-sm" aria-label="Checkout steps">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2"><span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs', i < step ? 'bg-accent text-white' : i === step ? 'bg-primary text-white' : 'bg-secondary')}>{i < step ? <Check size={13} /> : i + 1}</span><span className={cn('hidden sm:inline', i === step && 'font-medium text-primary')}>{s}</span><span className="h-px flex-1 bg-secondary" /></li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl bg-white p-6 shadow-soft sm:p-8">
          {step === 0 && (
            <form onSubmit={next0} noValidate>
              <h2 className="text-2xl">Delivery address</h2>
              {!authed && status !== 'loading' && <p className="mt-2 text-sm">Have an account? <Link href="/login?callbackUrl=/checkout" className="font-medium text-primary underline">Log in</Link> to use saved addresses, or continue as a guest.</p>}
              {saved.length > 0 && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {saved.map((a) => <button type="button" key={a.id} onClick={() => reset(a)} className="rounded-xl border border-secondary p-3 text-left text-sm hover:border-accent"><b className="text-primary">{a.label} · {a.name}</b><br />{a.line1}, {a.city} {a.pincode}</button>)}
                </div>
              )}
              <div className="mt-6"><AddressFields register={register} errors={errors} /></div>
              {!authed && (
                <div className="mt-4"><label htmlFor="g-email" className="mb-1.5 block text-sm font-medium text-primary">Email for order updates</label>
                  <input id="g-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-xl bg-background px-4 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent" />
                  {emailErr && <p className="mt-1 text-xs text-highlight" role="alert">{emailErr}</p>}</div>
              )}
              {authed && <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} className="accent-[#2A211D]" /> Save this address for next time</label>}
              <Button type="submit" size="lg" className="mt-6">Continue to shipping</Button>
            </form>
          )}
          {step === 1 && (
            <div><h2 className="text-2xl">Shipping method</h2>
              <div className="mt-5 space-y-3">{shipOpts.map(([k, t, s]) => <Box key={k} on={ship === k} onClick={() => setShip(k)} title={t} sub={`${s} · ${k === 'express' ? formatPrice(149) : shippingFor(local.subtotal - local.discount) === 0 ? 'Free' : formatPrice(SHIPPING_FEE)}`} />)}</div>
              <div className="mt-6 flex gap-3"><Button variant="outline" onClick={() => setStep(0)}>Back</Button><Button onClick={() => setStep(2)}>Continue to payment</Button></div></div>
          )}
          {step === 2 && (
            <div><h2 className="text-2xl">Payment</h2>
              <div className="mt-5 space-y-3">
                {(quote?.upiEnabled ?? true) && <Box on={pay === 'upi'} onClick={() => setPay('upi')} icon={QrCode} title="Scan QR code and pay (UPI)" sub="Pay with GPay, PhonePe, Paytm or any UPI app. Confirmed instantly" />}
                {(quote?.cardEnabled ?? true) && <Box on={pay === 'razorpay'} onClick={() => setPay('razorpay')} icon={CreditCard} title="Cards, net banking and wallets" sub="Secure checkout via Razorpay" />}
                {(quote?.codEnabled ?? true) && <Box on={pay === 'cod'} onClick={() => setPay('cod')} icon={Banknote} title="Cash on delivery" sub="Pay when your order arrives" />}
              </div>
              <label className="mt-6 flex items-center gap-2 text-sm"><input type="checkbox" checked={gst} onChange={(e) => setGst(e.target.checked)} className="accent-[#2A211D]" /> I need a GST invoice</label>
              {gst && <input value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} placeholder="GSTIN, e.g. 24ABCDE1234F1Z5" aria-label="GSTIN" className="mt-3 h-12 w-full rounded-xl bg-background px-4 text-sm uppercase text-primary outline-none ring-1 ring-secondary focus:ring-accent" />}
              <div className="mt-6 flex gap-3"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={() => setStep(3)}>Review order</Button></div></div>
          )}
          {step === 3 && (
            <div><h2 className="text-2xl">Review your order</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div><dt className="font-medium text-primary">Deliver to</dt><dd>{getValues('name')}, {getValues('line1')} {getValues('line2')}, {getValues('city')}, {getValues('state')} {getValues('pincode')} · {getValues('phone')}</dd></div>
                {!authed && <div><dt className="font-medium text-primary">Email</dt><dd>{email}</dd></div>}
                <div><dt className="font-medium text-primary">Shipping</dt><dd>{shipOpts.find(([k]) => k === ship)[1]}</dd></div>
                <div><dt className="font-medium text-primary">Payment</dt><dd>{pay === 'cod' ? 'Cash on delivery' : pay === 'upi' ? 'QR code (UPI)' : 'Online (Razorpay)'}{gst && gstin ? ` · GSTIN ${gstin}` : ''}</dd></div>
              </dl>
              {quoteErr && <p className="mt-4 rounded-xl bg-highlight/10 p-3 text-sm text-highlight" role="alert">{quoteErr} <Link href="/cart" className="underline">Edit bag</Link></p>}
              <div className="mt-6 flex gap-3"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button size="lg" disabled={placing || !!quoteErr} onClick={place}>{placing ? 'Please wait…' : pay === 'cod' ? `Place order · ${formatPrice(q.total)}` : `Pay ${formatPrice(q.total)}`}</Button></div>
              <p className="mt-4 flex items-center gap-2 text-xs"><ShieldCheck size={14} className="text-accent" /> Prices are confirmed on our server when you place the order.</p></div>
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-soft lg:sticky lg:top-32">
          <h2 className="text-xl">Order summary</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto">
            {items.map((i) => <li key={i.key} className="flex gap-3 text-sm"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg"><ProductVisual src={catalog.find((p) => p.id === i.id)?.image} alt={i.name} /></div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-primary">{i.name}</p><p className="text-xs">{i.variant ? `${i.variant} · ` : ''}Qty {i.qty}</p></div><p className="text-primary">{formatPrice(i.price * i.qty)}</p></li>)}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-secondary pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(q.subtotal)}</dd></div>
            {q.discount > 0 && <div className="flex justify-between"><dt>Discount{coupon ? ` (${coupon.code})` : ''}</dt><dd className="text-[#4d7a52]">-{formatPrice(q.discount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{q.shipping === 0 ? 'Free' : formatPrice(q.shipping)}</dd></div>
            <div className="flex justify-between border-t border-secondary pt-3"><dt className="font-medium text-primary">Total</dt><dd className="font-serif text-2xl text-primary">{formatPrice(q.total)}</dd></div>
          </dl>
        </aside>
      </div>
      <UpiQrModal open={!!qrOrder} order={qrOrder} onClose={qrClosed} onPaid={(o) => goSuccess(o, 'paid')} onClaimed={(o) => goSuccess(o, 'review')} />
    </div>
  );
}
