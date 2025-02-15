import { model, Schema } from 'mongoose';
import { UserCollection } from './user.js';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.ObjectId, ref: UserCollection, unique: true }, //посилання на користувача
    accessToken: { type: String, required: true }, //токен
    refreshToken: { type: String, required: true }, //токен
    accessTokenValidUntil: { type: Date, required: true }, //час дії
    refreshTokenValidUntil: { type: Date, required: true }, //час дії
  },
  { timestamps: true, versionKey: false },
);

export const SessionsCollection = model('sessions', sessionSchema);
