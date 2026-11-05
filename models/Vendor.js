import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ name: String, email: String, user: { type: Schema.Types.ObjectId, ref: 'User' }, commissionPercent: { type: Number, default: 10 }, approved: { type: Boolean, default: false } }, { timestamps: true });
export default mongoose.models.Vendor || mongoose.model('Vendor', schema);
