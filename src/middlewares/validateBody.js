//обгортка валідаці для роутів

import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false, //щоб отримати всі можливі помилки валідації, а не першу з них
      allowUnknown: false, //??
      convert: false, //??
    });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad Request', {
      errors: err.details,
    });
    next(error);
  }
};
