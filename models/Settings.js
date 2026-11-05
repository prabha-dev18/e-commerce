import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ key: { type: String, unique: true, default: 'store' }, storeName: String, email: String, phone: String, freeShippingThreshold: { type: Number, default: 999 }, shippingFee: { type: Number, default: 59 }, gstPercent: { type: Number, default: 18 }, codEnabled: { type: Boolean, default: true }, emailTemplates: { orderSubject: String, orderIntro: String, signature: String }, homeSections: { type: Schema.Types.Mixed, default: {} } }, { timestamps: true });
export default mongoose.models.Settings || mongoose.model('Settings', schema);
