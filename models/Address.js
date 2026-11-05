import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User', index: true }, label: { type: String, default: 'Home' }, name: String, phone: String, line1: String, line2: String, city: String, state: String, pincode: String, isDefault: { type: Boolean, default: false } }, { timestamps: true });
export default mongoose.models.Address || mongoose.model('Address', schema);
