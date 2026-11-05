import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({ slug: { type: String, unique: true }, title: String, excerpt: String, body: String, image: String, tone: String, readTime: String, published: { type: Boolean, default: true }, publishedAt: { type: Date, default: Date.now } }, { timestamps: true });
export default mongoose.models.BlogPost || mongoose.model('BlogPost', schema);
