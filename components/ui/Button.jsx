'use client';
import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const variants = {
  // Dark gold gradient with a pressed-in bottom edge, so it looks like a physical button
  primary: 'bg-gold-cta text-white shadow-btn hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0 active:shadow-soft',
  outline: 'border border-primary/80 bg-white/40 text-primary backdrop-blur hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-3d',
  soft: 'bg-secondary text-primary shadow-soft hover:-translate-y-0.5 hover:bg-accent hover:text-white hover:shadow-3d',
  ghost: 'text-primary hover:bg-secondary',
};
const sizes = { sm: 'h-9 px-4 text-xs', md: 'h-11 px-6 text-sm', lg: 'h-12 px-8 text-sm' };

const Button = forwardRef(function Button({ href, variant = 'primary', size = 'md', className, children, ...props }, ref) {
  const cls = cn(
    'sheen inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50',
    variants[variant], sizes[size], className
  );
  if (href) return <Link ref={ref} href={href} className={cls} {...props}>{children}</Link>;
  return <button ref={ref} className={cls} {...props}>{children}</button>;
});
export default Button;
