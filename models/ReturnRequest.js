import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ order: { type: Schema.Types.ObjectId, ref: 'Order' }, user: { type: Schema.Types.ObjectId, ref: 'User' }, items: [{ productId: String, qty: Number }], reason: String, type: { type: String, enum: ['return', 'refund', 'exchange'], default: 'return' }, status: { type: String, enum: ['requested', 'approved', 'rejected', 'received', 'refunded'], default: 'requested' } }, { timestamps: true });
export default mongoose.models.ReturnRequest || mongoose.model('ReturnRequest', schema);
