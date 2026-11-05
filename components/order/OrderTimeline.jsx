import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [['placed', 'Placed'], ['confirmed', 'Confirmed'], ['packed', 'Packed'], ['shipped', 'Shipped'], ['delivered', 'Delivered']];
export const statusTone = { placed: 'bg-secondary text-primary', confirmed: 'bg-accent text-white', packed: 'bg-accent text-white', shipped: 'bg-primary text-white', delivered: 'bg-[#4d7a52] text-white', cancelled: 'bg-highlight text-white', returned: 'bg-highlight text-white' };
const fmt = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export default function OrderTimeline({ status, tracking = [], courier, awb }) {
  const dead = status === 'cancelled' || status === 'returned';
  const idx = steps.findIndex(([k]) => k === status);
  return (
    <div>
      {dead ? (
        <p className="flex items-center gap-2 rounded-xl bg-highlight/10 p-3 text-sm text-highlight"><X size={16} /> This order was {status}.</p>
      ) : (
        <ol className="flex items-start" aria-label="Order progress">
          {steps.map(([k, l], i) => (
            <li key={k} className="relative flex flex-1 flex-col items-center text-center">
              {i > 0 && <span className={cn('absolute left-[-50%] top-4 h-0.5 w-full', i <= idx ? 'bg-accent' : 'bg-secondary')} />}
              <span className={cn('relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs', i <= idx ? 'bg-accent text-white' : 'bg-secondary text-body')}>{i <= idx ? <Check size={15} /> : i + 1}</span>
              <span className={cn('mt-2 text-xs', i <= idx ? 'font-medium text-primary' : '')}>{l}</span>
            </li>
          ))}
        </ol>
      )}
      {(courier || awb) && <p className="mt-4 text-sm">Courier: <b className="text-primary">{courier || 'Assigned soon'}</b>{awb && <> · Tracking no: <b className="text-primary">{awb}</b></>}</p>}
      <ul className="mt-5 space-y-2 border-l border-accent/40 pl-4 text-sm">
        {[...tracking].reverse().map((t, i) => <li key={i}><span className="font-medium capitalize text-primary">{t.status}</span> · {t.note}<br /><span className="text-xs">{fmt(t.at)}</span></li>)}
      </ul>
    </div>
  );
}
