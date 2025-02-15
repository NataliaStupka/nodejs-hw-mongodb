//Схема валідації

import Joi from 'joi';

//створенні нового контакта:
export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  //phoneNumber: Joi.number().integer().min(6).max(16).required(),
  phoneNumber: Joi.string().min(6).max(16).required(),
  email: Joi.string().min(3).max(20), //.required()
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

//студента при його оновленні
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(6).max(16),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
