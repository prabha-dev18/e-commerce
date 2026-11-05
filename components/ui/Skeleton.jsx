import { cn } from '@/lib/utils';
export default function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-xl', className)} aria-hidden="true" />;
}
