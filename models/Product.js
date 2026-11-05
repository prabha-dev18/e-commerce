import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  sku: String,
  brand: { type: String, index: true },
  name: { type: String, required: true },
  description: String, ingredients: String, howTo: String, benefits: [String],
  price: { type: Number, required: true }, mrp: Number, discount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }, reviews: { type: Number, default: 0 },
  badge: String, tone: String, image: String, images: [String],
  category: { type: String, index: true }, sub: { type: String, index: true },
  concern: [String], skin: [String], finish: String, size: String, sizeBucket: String,
  swatches: [String], tags: [String], tabs: [String],
  vegan: Boolean, cf: Boolean, pf: Boolean,
  stock: { type: Number, default: 0 }, created: { type: Number, default: 0 }, pop: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  seo: { title: String, description: String },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' },
}, { timestamps: true });
export default mongoose.models.Product || mongoose.model('Product', schema);
