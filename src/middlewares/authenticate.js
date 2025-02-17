//аунтефікація (без авторизації)
//перевіряє чи є такий користувач, якщо є то запускаємо його

import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

export const authentificate = async (req, res, next) => {
  //кладемо відповідний хедер
  const authHeader = req.get('Authorization');

  try {
    if (!authHeader) {
      throw new createHttpError(401, 'No Authorization header provider');
    }
    //отримуємо токен
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer') {
      throw new createHttpError(
        401,
        'Authorization header should be of Bearer type!',
      );
    }
    //якщо токен не прийшов
    if (!token) {
      throw new createHttpError(401, 'No Access token provided!');
    }
    //перевірка на наявність сесії
    const session = await SessionsCollection.findOne({ accessToken: token }); //шукаємо по access token
    if (!session) {
      //якщо немає session
      throw new createHttpError(401, 'No active session found!');
    }

    //чи валідний токен, чи вже 'протух'
    if (session.accessTokenValidUntil < new Date()) {
      throw new createHttpError(401, 'Access token expired!');
    }

    const user = await UserCollection.findById(session.userId);
    if (!user) {
      //якщо немає user - видаляємо сесію
      await SessionsCollection.findByIdAndDelete(session._id);
      throw new createHttpError(401, 'No user found for such session!');
    }

    //req.locals.user = user;
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
