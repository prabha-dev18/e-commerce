import { z } from 'zod';

const password = z.string().min(8, 'Use at least 8 characters').regex(/[A-Za-z]/, 'Include a letter').regex(/\d/, 'Include a number');
export const registerSchema = z.object({ name: z.string().trim().min(2, 'Enter your name').max(60), email: z.string().trim().toLowerCase().email('Enter a valid email'), phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit mobile number').optional().or(z.literal('')), password });
export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email'), password: z.string().min(1, 'Enter your password') });
export const forgotSchema = z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email') });
export const resetSchema = z.object({ token: z.string().min(20), password });
export const profileSchema = z.object({ name: z.string().trim().min(2).max(60).optional(), phone: z.string().trim().regex(/^[6-9]\d{9}$/).optional().or(z.literal('')) });
export const cartItem = z.object({ key: z.string().max(120), id: z.string().max(80), slug: z.string().max(120).optional(), name: z.string().max(200), price: z.number().min(0).max(1e6), image: z.string().max(500).nullable().optional(), variant: z.string().max(120).nullable().optional(), qty: z.number().int().min(1).max(10) });
export const cartSchema = z.object({ items: z.array(cartItem).max(50) });
export const wishlistSchema = z.object({ ids: z.array(z.string().max(80)).max(200) });
export const couponSchema = z.object({ code: z.string().trim().toUpperCase().min(3).max(30), items: z.array(z.object({ id: z.string(), qty: z.number().int().min(1).max(10), price: z.number().min(0) })).min(1).max(50) });
export const reviewSchema = z.object({ productId: z.string().max(80), rating: z.number().int().min(1).max(5), text: z.string().trim().min(10, 'Write at least 10 characters').max(1500) });
export const newsletterSchema = z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email') });
export const contactSchema = z.object({ name: z.string().trim().min(2).max(60), email: z.string().trim().toLowerCase().email(), subject: z.string().trim().max(120).optional(), message: z.string().trim().min(10).max(2000) });

export const addressSchema = z.object({
  label: z.string().trim().max(20).optional(),
  name: z.string().trim().min(2, 'Enter the full name').max(60),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit mobile number'),
  line1: z.string().trim().min(5, 'Enter the address').max(120),
  line2: z.string().trim().max(120).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Enter the city').max(60),
  state: z.string().trim().min(2, 'Enter the state').max(60),
  pincode: z.string().trim().regex(/^[1-8]\d{5}$/, 'Enter a valid 6-digit pincode'),
  isDefault: z.boolean().optional(),
});
const line = z.object({ id: z.string().max(80), qty: z.number().int().min(1).max(10), variant: z.string().max(120).nullable().optional(), name: z.string().max(200).optional() });
export const quoteSchema = z.object({ items: z.array(line).min(1).max(50), couponCode: z.string().trim().toUpperCase().max(30).optional().or(z.literal('')), shippingMethod: z.enum(['standard', 'express']).default('standard') });
export const orderSchema = quoteSchema.extend({
  email: z.string().trim().toLowerCase().email('Enter a valid email').optional(),
  address: addressSchema.omit({ label: true, isDefault: true }),
  paymentMethod: z.enum(['cod', 'razorpay', 'upi']),
  gstin: z.string().trim().toUpperCase().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, 'Enter a valid GSTIN').optional().or(z.literal('')),
  saveAddress: z.boolean().optional(),
});
export const utrSchema = z.object({
  utr: z.string().trim().regex(/^\d{12}$/, 'Enter the 12-digit UPI reference (UTR) number from your payment app').optional().or(z.literal('')),
  autoConfirm: z.boolean().optional(),
});
export const verifySchema = z.object({
  orderId: z.string().max(40),
  mock: z.boolean().optional(),
  razorpay_order_id: z.string().max(60).optional(),
  razorpay_payment_id: z.string().max(60).optional(),
  razorpay_signature: z.string().max(200).optional(),
});
export const passwordChangeSchema = z.object({ current: z.string().min(1), password });
export const returnSchema = z.object({ items: z.array(z.object({ productId: z.string(), qty: z.number().int().min(1).max(10) })).min(1), reason: z.string().trim().min(5, 'Tell us the reason').max(500), type: z.enum(['return', 'refund', 'exchange']).default('return') });
export const trackSchema = z.object({ number: z.string().trim().toUpperCase().min(6).max(30), email: z.string().trim().toLowerCase().email() });
