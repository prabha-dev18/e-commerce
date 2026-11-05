import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
  code: { type: String, unique: true, uppercase: true },
  description: String,
  type: { type: String, enum: ['percent', 'flat'], default: 'percent' },
  value: Number, minOrder: { type: Number, default: 0 }, maxDiscount: Number,
  expiresAt: Date, usageLimit: Number, usedCount: { type: Number, default: 0 },
  firstOrderOnly: { type: Boolean, default: false }, active: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.models.Coupon || mongoose.model('Coupon', schema);
