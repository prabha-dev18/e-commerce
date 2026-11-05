import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ eyebrow: String, title: String, text: String, cta: String, href: String, image: String, tone: String, placement: { type: String, default: 'hero' }, order: { type: Number, default: 0 }, active: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.models.Banner || mongoose.model('Banner', schema);
