// Middleware для обробких помилки, яку не було передбачено

//Імпортуємо клас HttpError для обробки помилок HTTP
import { HttpError } from 'http-errors';
import { MongooseError } from 'mongoose'; //????

export const errorHandler = (err, req, res, next) => {
  // Перевірка, чи отримали ми помилку від createHttpError
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  if (err instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: err.message,
      name: 'Mongoose error',
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    error: err.message,
    name: 'Internal server error',
  });
};
