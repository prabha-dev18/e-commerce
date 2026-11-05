import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ name: String, email: String, subject: String, message: String, handled: { type: Boolean, default: false } }, { timestamps: true });
export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', schema);
