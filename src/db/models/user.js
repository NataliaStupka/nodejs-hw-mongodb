//схема контактів

import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarurl: { type: String, required: false }, //для картинок
    role: {
      type: String,
      required: true,
      enum: ['teacher', 'parent'],
      default: 'parent',
    },
  },
  { timestamps: true, versionKey: false }, //timestamps автоматичне створення createdAt та updatedAt
);

// //видаляємо поле password при response
// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   return obj;
// };
//як варіант
//замінили utils/serializeUser.js - поля які повертаємо при response

export const UserCollection = model('users', userSchema);
