import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User', index: true }, title: String, body: String, href: String, read: { type: Boolean, default: false } }, { timestamps: true });
export default mongoose.models.Notification || mongoose.model('Notification', schema);
