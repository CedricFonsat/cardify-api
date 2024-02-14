import mongoose, { Schema } from 'mongoose';
import { PLACEHOLDER_IMG } from '../utils/source';
import { CollectionType } from '../types/Interface';

const collectionSchema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  logo: { type: String, default: PLACEHOLDER_IMG},
  cover: { type: String, default: PLACEHOLDER_IMG },
  backdrop: { type: String, default: PLACEHOLDER_IMG },
  ifAvailable: { type: Boolean, default: false },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
});

export const Collection = mongoose.model<CollectionType>('Collection', collectionSchema);