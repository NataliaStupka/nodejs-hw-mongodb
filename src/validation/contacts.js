//Схема валідації

import Joi from 'joi';
import { isValidObjectId } from 'mongoose'; //для авторизації

//створенні нового контакта:
export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  //phoneNumber: Joi.number().integer().min(6).max(16).required(),
  phoneNumber: Joi.string().min(6).max(16).required(),
  email: Joi.string().min(3).max(20), //.required()
  isFavourite: Joi.string(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),

  //для авторизації (винести в окрему функцію)
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Parent id should be a valid mongo id');
    }
    return true;
  }),
});

//студента при його оновленні
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(6).max(16),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
