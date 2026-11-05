import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ slug: { type: String, unique: true }, name: String, parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null }, image: String, order: { type: Number, default: 0 }, active: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.models.Category || mongoose.model('Category', schema);
