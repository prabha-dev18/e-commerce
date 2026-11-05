import { ApiError } from './errors';
import { evaluateCoupon } from './coupon';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import Settings from '@/models/Settings';
import Order from '@/models/Order';

export const SHIPPING = { standard: { label: 'Standard (2 to 5 days)', fee: 59 }, express: { label: 'Express (1 to 2 days)', fee: 149 } };

/** The only place prices are decided. Never trust prices sent by the browser. */
export async function priceOrder({ items, couponCode, shippingMethod = 'standard', userId }) {
  const [products, settings] = await Promise.all([Product.find({ id: { $in: items.map((i) => i.id) }, active: true }).lean(), Settings.findOne({ key: 'store' }).lean()]);
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const threshold = settings?.freeShippingThreshold ?? 999;
  const gst = settings?.gstPercent ?? 18;

  const lines = items.map((i) => {
    const p = byId[i.id];
    if (!p) throw new ApiError(`${i.name || 'An item'} is no longer available. Please remove it from your bag.`, 409);
    if (p.stock < i.qty) throw new ApiError(p.stock === 0 ? `${p.name} is out of stock` : `Only ${p.stock} left of ${p.name}`, 409);
    const unit = /value pack/i.test(i.variant || '') ? Math.round(p.price * 1.8) : p.price; // matches the Value pack size on the product page
    return { productId: p.id, slug: p.slug, name: p.name, image: p.image, variant: i.variant || '', price: unit, qty: i.qty };
  });
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);

  let discount = 0, applied = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode });
    const isFirstOrder = userId ? !(await Order.exists({ user: userId, status: { $ne: 'cancelled' } })) : true;
    const r = evaluateCoupon(coupon, { subtotal, isFirstOrder });
    if (!r.ok) throw new ApiError(r.message, 400);
    discount = r.discount; applied = coupon.code;
  }
  const net = subtotal - discount;
  const m = SHIPPING[shippingMethod] || SHIPPING.standard;
  const shipping = shippingMethod === 'standard' && net >= threshold ? 0 : m.fee;
  const tax = Math.round((net * gst) / (100 + gst)); // prices include GST; shown on the invoice
  return { lines, subtotal, discount, couponCode: applied, shipping, tax, total: net + shipping, codEnabled: settings?.codEnabled ?? true };
}
