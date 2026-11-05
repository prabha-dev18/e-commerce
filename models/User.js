import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: String,
  passwordHash: String,
  provider: { type: String, enum: ['credentials', 'google'], default: 'credentials' },
  role: { type: String, enum: ['user', 'admin', 'manager', 'support'], default: 'user' },
  emailVerified: { type: Boolean, default: false },
  verifyToken: String,
  resetTokenHash: String,
  resetExpires: Date,
  points: { type: Number, default: 0 },
  referralCode: String,
  blocked: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.models.User || mongoose.model('User', schema);
