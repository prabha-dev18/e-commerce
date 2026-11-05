import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
  productId: { type: String, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String, rating: { type: Number, min: 1, max: 5 }, text: String,
  verified: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  helpful: { type: Number, default: 0 }, helpfulBy: [{ type: Schema.Types.ObjectId }],
}, { timestamps: true });
export default mongoose.models.Review || mongoose.model('Review', schema);
