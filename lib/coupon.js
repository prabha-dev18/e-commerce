/** Returns { ok, discount, message }. coupon is a Coupon document; ctx: { subtotal, isFirstOrder } */
export function evaluateCoupon(coupon, { subtotal, isFirstOrder = true }) {
  const no = (message) => ({ ok: false, discount: 0, message });
  if (!coupon || !coupon.active) return no('This code is not valid');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return no('This code has expired');
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return no('This code has reached its usage limit');
  if (coupon.firstOrderOnly && !isFirstOrder) return no('This code is only for your first order');
  if (subtotal < coupon.minOrder) return no(`Add ₹${Math.ceil(coupon.minOrder - subtotal)} more to use this code`);
  let discount = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.round(Math.min(discount, subtotal));
  return { ok: true, discount, message: `${coupon.code} applied. You save ₹${discount}` };
}
