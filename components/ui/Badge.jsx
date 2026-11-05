import { cn } from '@/lib/utils';

const tones = {
  sale: 'bg-highlight text-white',
  new: 'bg-primary text-white',
  gold: 'bg-accent text-white',
  soft: 'bg-secondary text-primary',
};
export default function Badge({ tone = 'soft', className, children }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider', tones[tone], className)}>
      {children}
    </span>
  );
}
