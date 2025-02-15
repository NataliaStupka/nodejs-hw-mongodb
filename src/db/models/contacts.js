//схема контактів
//

import { Schema, Types, model } from 'mongoose';
import { UserCollection } from './user.js';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    parentId: { type: Types.ObjectId, ref: UserCollection, required: true },
  },
  { timestamps: true, versionKey: false }, //timestamps автоматичне створення createdAt та updatedAt
);
export const ContactCollection = model('contacts', contactSchema);
// model(ім'я колекції, схема);
// createdAt (дата створення)
// updatedAt (дата оновлення)
