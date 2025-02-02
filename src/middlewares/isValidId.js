//перевіряти правильність id(ідентифікаторів), переданих у параметрах запиту

import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { studentId } = req.params;

  if (!isValidObjectId(studentId)) {
    throw createHttpError(404, 'Bad Request');
  }
  next();
};

//isValidId застосувати її в усіх роутах, які працюють з id студента
