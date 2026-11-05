import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ email: { type: String, unique: true, lowercase: true }, active: { type: Boolean, default: true }, source: String }, { timestamps: true });
export default mongoose.models.Newsletter || mongoose.model('Newsletter', schema);
