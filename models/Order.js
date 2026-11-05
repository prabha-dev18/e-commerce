import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
  number: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  guestEmail: String,
  items: [{ productId: String, slug: String, name: String, image: String, variant: String, price: Number, qty: Number }],
  address: { name: String, phone: String, line1: String, line2: String, city: String, state: String, pincode: String },
  gstin: String,
  shippingMethod: { type: String, default: 'standard' },
  payment: { method: { type: String, enum: ['razorpay', 'upi', 'cod'], default: 'cod' }, status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' }, razorpayOrderId: String, razorpayPaymentId: String, qrId: String, qrImage: String, qrExpiresAt: Date, utr: String, utrAt: Date, paidAt: Date },
  coupon: { code: String, discount: Number },
  subtotal: Number, shipping: Number, tax: Number, total: Number,
  status: { type: String, enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'], default: 'placed', index: true },
  tracking: [{ status: String, note: String, at: { type: Date, default: Date.now } }],
  awb: String, courier: String,
  pointsAwarded: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.models.Order || mongoose.model('Order', schema);
