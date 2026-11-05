import clsx from 'clsx';

export const cn = (...args) => clsx(args);
export const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
export const FREE_SHIPPING_THRESHOLD = 999;
export const SITE_NAME = 'Lumière';
export const SHIPPING_FEE = 59;
export const shippingFor = (amountAfterDiscount) => (amountAfterDiscount >= FREE_SHIPPING_THRESHOLD || amountAfterDiscount === 0 ? 0 : SHIPPING_FEE);
