import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ slug: { type: String, unique: true }, name: String, logo: String, description: String, active: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.models.Brand || mongoose.model('Brand', schema);
