import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User', unique: true }, items: [{ key: String, id: String, slug: String, name: String, price: Number, image: String, variant: String, qty: Number }] }, { timestamps: true });
export default mongoose.models.Cart || mongoose.model('Cart', schema);
