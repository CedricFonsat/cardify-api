import mongoose, { Schema } from 'mongoose';
import { PLACEHOLDER_IMG } from '../utils/source';
import { CardType } from '../types/Interface';

const cardSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: PLACEHOLDER_IMG },
  author: { type: String, default: 'cardify' },
  collections: { type: [],  required: false},
  ifAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  users: { 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    default: function() { return [] }
  }
});

export const Card = mongoose.model<CardType>('Card', cardSchema);