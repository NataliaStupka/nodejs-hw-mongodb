//перевіряти правильність id(ідентифікаторів), переданих у параметрах запиту

import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const validateMongoId =
  (name = 'id') =>
  (req, res, next) => {
    console.log('????:', req.params);

    // const { contactId } = req.params;
    //якщо не валідний
    if (!isValidObjectId(req.params[name])) {
      next(createHttpError(404, `${name} is not a valid MongoId`));
    }
    next();
  };

//isValidId застосувати її в усіх роутах, які працюють з id контакта
