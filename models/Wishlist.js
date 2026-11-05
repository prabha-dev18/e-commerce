import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User', unique: true }, ids: [String] }, { timestamps: true });
export default mongoose.models.Wishlist || mongoose.model('Wishlist', schema);
