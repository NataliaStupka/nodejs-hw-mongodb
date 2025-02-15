//створення користувача

import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js'; //схема для юсера
import bcrypt from 'bcrypt'; //хешування паролів
import { randomBytes } from 'crypto'; //Генерація випадкових токенів
//session
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/env.js';
import { SessionsCollection } from '../db/models/session.js';

//для перевикористання:
const createSession = () => ({
  //нові токени доступу та оновлення
  accessToken: randomBytes(30).toString('base64'), //рандомна
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN), //15 minutes
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN), //30 days
});

//REGISTER     //payload - name, email, password
export const registerUser = async ({ name, email, password }) => {
  //1 спосіб - перевіряємо базу, чи є юзер з таким емейлом
  let user = await UserCollection.findOne({ email: email });
  if (user) {
    throw createHttpError(409, 'Email in use!');
  }
  //хешування пароля
  const hashedPassword = await bcrypt.hash(password, 10); //10 - кількість дій(раундів)
  user = await UserCollection.create({ name, email, password: hashedPassword });

  return user;
  //     //2й спосіб //user з таким email вже зареєстрований
  //   try {
  //     const user = await UserCollection.create(payload);
  //     return user;
  //   } catch (err) {
  //     //номер помилки подивитися через дебагер
  //     if (err.code === 11000) {
  //       throw createHttpError(409, 'User alredy registred!');
  //     }
  //     throw err;
  //   }
};

//LOGIN
export const loginUser = async ({ email, password }) => {
  //перевіряємо базу, чи є юзер з таким емейлом
  const user = await UserCollection.findOne({ email: email });
  console.log(`Services - email: ${email}, password: ${password}`);
  console.log('Services - USERRR:', user);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  // Порівнюємо хеші паролів
  const arePasswordsEquel = await bcrypt.compare(password, user.password);
  if (!arePasswordsEquel) {
    throw createHttpError(401, 'Login or password is incorrect!'); //якщо паролі не однакові
  }

  //видаляємо стару сесію для уникнення конфліктів з новою сесією.
  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    userId: user._id,
    ...createSession(),
  });
};

//REFRESH
export const refreshSession = async ({ sessionId, refreshToken }) => {
  console.log(
    `Services-refresh_req: id - ${sessionId}, token - ${refreshToken}`,
  );
  //отримали сесію
  const session = await SessionsCollection.findOne({
    //sessionId: req.cookies.sessionId,
    _id: sessionId,
    refreshToken,
  });
  console.log('services-auth_session:', session);

  //сесії не має
  if (!session) {
    throw createHttpError(401, 'Session not found!');
  }
  //чи token ще працюючий (якщо сесія 'протухла')
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session token expired!');
  }
  //
  const user = await UserCollection.findById(session.userId);
  if (!user) {
    throw createHttpError(401, 'Session user is not found!');
  }

  //delete old session
  await SessionsCollection.findByIdAndDelete(session._id);

  //create new session
  const newSession = await SessionsCollection.create({
    userId: session.userId,
    ...createSession(),
  });

  return newSession;
};

//LOGOUT
export const logoutUser = async (sessionId) => {
  console.log('services-logout_sessionId:', sessionId);
  await SessionsCollection.deleteOne({ _id: sessionId });
};
