import { Star } from 'lucide-react';

export default function Rating({ value = 0, count, size = 14 }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={size} className={n <= Math.round(value) ? 'fill-accent text-accent' : 'text-secondary fill-secondary'} />
        ))}
      </div>
      {count != null && <span className="text-xs text-body">({count})</span>}
    </div>
  );
}
