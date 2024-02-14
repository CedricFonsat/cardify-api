import mongoose, { Schema } from 'mongoose';
import { UserType } from '../types/Interface';
import { PLACEHOLDER_IMG } from '../utils/source';

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false, default: PLACEHOLDER_IMG },
  wallet: { type: Number, required: true, default: 300 },
  soldCards: { type: [], required: false},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, required: true, default: 'user' },
  badge: { type: String, required: true, default: 'bronze' },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  resetToken: String,
  resetTokenExpiration: Date,
});

export const User = mongoose.model<UserType>('User', userSchema);
