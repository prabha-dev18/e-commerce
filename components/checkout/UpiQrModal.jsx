'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, RefreshCw, Smartphone, ShieldCheck, FileText, Copy, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/**
 * Shows a UPI QR code for an order, checks every 3 seconds whether it has been paid,
 * and then shows a "Payment done" screen with the invoice.
 * order: { id, t, number, total }. Callbacks: onPaid(order), onClose(), onClaimed(order) (direct UPI only).
 */
export default function UpiQrModal({ open, order, onPaid, onClose, onClaimed }) {
  const [qr, setQr] = useState(null);
  const [img, setImg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [left, setLeft] = useState(0);
  const [utr, setUtr] = useState('');
  const [utrErr, setUtrErr] = useState('');
  const [sending, setSending] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);
  const paidRef = useRef(onPaid);
  paidRef.current = onPaid;

  const invoiceToken = qr?.t || order?.t || '';
  const q = `t=${encodeURIComponent(invoiceToken)}`;

  const create = useCallback(async () => {
    if (!order) return;
    setLoading(true); setErr(''); setImg(''); setQr(null);
    try {
      const s = await fetch(`/api/orders/${order.id}/qr?${q}`, { cache: 'no-store' });
      const sj = await s.json().catch(() => ({}));
      if (!s.ok) throw new Error(sj.error || 'Could not load this order');
      if (sj.status === 'paid') { setPaid(true); return; }
      if (sj.status === 'cancelled') throw new Error('This order was cancelled. Please place a new order.');
      const r = await fetch(`/api/orders/${order.id}/qr?${q}`, { method: 'POST' });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Could not create the QR code');
      if (j.mode === 'direct' || !j.imageUrl) {
        const QR = (await import('qrcode')).default;
        setImg(await QR.toDataURL(j.link, { width: 300, margin: 1, color: { dark: '#2A211D', light: '#FFFFFF' } }));
      } else {
        setImg(j.imageUrl);
      }
      setClaimed(!!j.claimed);
      setQr(j);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, [order, q]);

  useEffect(() => { if (open && order) { setPaid(false); setUtr(''); setUtrErr(''); create(); } }, [open, order?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown
  useEffect(() => {
    if (!open || !qr?.expiresAt || paid) return;
    const tick = () => setLeft(Math.max(0, Math.ceil((new Date(qr.expiresAt).getTime() - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [open, qr, paid]);

  // Poll for payment
  useEffect(() => {
    if (!open || !qr || paid) return;
    let stop = false;
    const id = setInterval(async () => {
      try {
        const r = await fetch(`/api/orders/${order.id}/qr?${q}`, { cache: 'no-store' });
        const j = await r.json().catch(() => ({}));
        if (stop || !r.ok) return;
        if (j.status === 'paid') setPaid(true);
        else if (j.status === 'cancelled') setErr('This order was cancelled.');
      } catch { /* try again on the next tick */ }
    }, 3000);
    return () => { stop = true; clearInterval(id); };
  }, [open, qr, paid, order, q]);

  // Payment done: celebrate, then continue
  useEffect(() => {
    if (!paid) return;
    toast.success('Payment received successfully!');
    const id = setTimeout(() => paidRef.current?.({ ...order, t: invoiceToken }), 3500);
    return () => clearTimeout(id);
  }, [paid]); // eslint-disable-line react-hooks/exhaustive-deps

  const copyVpa = () => {
    if (!qr?.vpa) return;
    navigator.clipboard.writeText(qr.vpa);
    setCopied(true);
    toast.success('UPI ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmPayment = async (auto = true) => {
    setUtrErr('');
    if (!auto && utr.trim() && !/^\d{12}$/.test(utr.trim())) {
      return setUtrErr('Enter a valid 12-digit UTR reference number');
    }
    setSending(true);
    try {
      const r = await fetch(`/api/orders/${order.id}/qr/claim?${q}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utr: utr.trim() || undefined, autoConfirm: auto }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Could not verify payment');
      if (j.paid) {
        setPaid(true);
      } else {
        setClaimed(true);
        onClaimed?.({ ...order, t: invoiceToken });
      }
    } catch (e2) {
      setUtrErr(e2.message);
      toast.error(e2.message);
    } finally {
      setSending(false);
    }
  };

  const amount = qr?.amount ?? order?.total ?? 0;
  const expired = qr && left === 0 && !paid;
  const close = () => (paid ? paidRef.current?.({ ...order, t: invoiceToken }) : onClose?.());

  return (
    <Modal open={open && !!order} onClose={close} title={paid ? '' : 'Scan and pay'} className="max-w-md text-center">
      {paid ? (
        <div className="flex flex-col items-center gap-3 py-6" role="status">
          <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
            <CheckCircle2 size={84} className="text-[#4d7a52]" />
          </motion.div>
          <h3 className="font-serif text-3xl text-primary">Payment done</h3>
          <p className="text-sm">
            {formatPrice(amount)} received for order <b className="text-primary">{order.number}</b>.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button size="sm" variant="soft" href={`/api/orders/${order.id}/invoice?${q}&download=1`} target="_blank" rel="noopener">
              <FileText size={14} /> Download invoice
            </Button>
            <Button size="sm" onClick={() => paidRef.current?.({ ...order, t: invoiceToken })}>
              Continue
            </Button>
          </div>
          <p className="text-xs text-body">Taking you to your order summary…</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm">
            Order <b className="text-primary">{order?.number}</b> · Pay <b className="font-serif text-xl text-primary">{formatPrice(amount)}</b>
          </p>

          {loading && (
            <div className="flex h-[260px] w-[260px] animate-pulse items-center justify-center rounded-2xl bg-secondary text-sm" aria-live="polite">
              Creating your QR code…
            </div>
          )}

          {err && !loading && (
            <div className="w-full rounded-xl bg-highlight/10 p-4 text-sm text-highlight" role="alert">
              {err}
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={create}><RefreshCw size={14} /> Try again</Button>
              </div>
            </div>
          )}

          {qr && !loading && !err && (
            <>
              <div className="relative rounded-2xl border border-secondary bg-white p-3 shadow-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`UPI QR code to pay ${formatPrice(amount)}`}
                  width={260}
                  height={260}
                  className={`h-[260px] w-[260px] ${expired ? 'opacity-20 blur-[2px]' : ''}`}
                />
                {expired && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <p className="font-medium text-primary">QR expired</p>
                    <Button size="sm" onClick={create}><RefreshCw size={14} /> New QR code</Button>
                  </div>
                )}
              </div>

              {!expired && (
                <p className="flex items-center gap-1.5 text-xs text-body">
                  <Clock size={13} className="text-accent" /> Valid for <b className="text-primary">{mmss(left)}</b>
                </p>
              )}

              {qr.vpa && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-secondary/60 px-3 py-1.5 text-xs text-primary">
                  <span>Payee UPI: <b>{qr.vpa}</b></span>
                  <button
                    type="button"
                    onClick={copyVpa}
                    className="flex items-center gap-1 rounded bg-white px-2 py-0.5 font-medium text-primary shadow-xs hover:bg-background"
                    title="Copy UPI ID"
                  >
                    {copied ? <Check size={11} className="text-[#4d7a52]" /> : <Copy size={11} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}

              <ol className="w-full space-y-1 text-left text-xs sm:text-sm text-body">
                <li>1. Open any UPI app (GPay, PhonePe, Paytm, BHIM).</li>
                <li>2. Scan this QR code and pay exactly <b className="text-primary">{formatPrice(amount)}</b>.</li>
                <li>3. Click below once paid to verify and confirm instantly.</li>
              </ol>

              {qr.mode === 'direct' && qr.link && (
                <Button href={qr.link} className="w-full sm:hidden" variant="soft">
                  <Smartphone size={16} /> Open UPI app
                </Button>
              )}

              {/* Instant Payment Confirmation Button */}
              <div className="w-full space-y-2 pt-1">
                <Button
                  size="md"
                  className="w-full"
                  disabled={sending}
                  onClick={() => confirmPayment(true)}
                >
                  <Sparkles size={16} className="text-accent mr-1" />
                  {sending ? 'Verifying payment…' : 'I have completed payment · Confirm'}
                </Button>

                {/* Optional UTR input toggle / field */}
                <details className="w-full text-left">
                  <summary className="cursor-pointer text-xs text-body hover:text-primary">
                    Have a 12-digit UPI UTR reference? Enter it here
                  </summary>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="utr"
                      inputMode="numeric"
                      maxLength={12}
                      value={utr}
                      onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))}
                      placeholder="12-digit UTR reference"
                      className="h-10 min-w-0 flex-1 rounded-xl bg-background px-3 text-xs sm:text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={sending || !utr.trim()}
                      onClick={() => confirmPayment(true)}
                    >
                      Verify UTR
                    </Button>
                  </div>
                  {utrErr && <p className="mt-1 text-xs text-highlight" role="alert">{utrErr}</p>}
                </details>
              </div>

              {claimed && !paid && (
                <div className="w-full rounded-xl bg-secondary/70 p-3 text-xs" role="status">
                  UPI reference registered. Confirming with your bank shortly…
                </div>
              )}

              <p className="flex items-center gap-1.5 text-xs text-body">
                <ShieldCheck size={13} className="text-accent" /> Secure UPI payment. We never see your UPI PIN.
              </p>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
