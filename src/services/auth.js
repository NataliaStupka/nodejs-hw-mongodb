//створення користувача

import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js'; //схема для юсера
import bcrypt from 'bcrypt'; //хешування паролів
import { randomBytes } from 'crypto'; //Генерація випадкових токенів
//session
import { ACCESS_TOKEN, ENV_VARS, REFRESH_TOKEN } from '../constants/env.js';
import { SessionsCollection } from '../db/models/session.js';
//скидання пароля
import jwt from 'jsonwebtoken'; //для роботи із JWT-токеном
import Handlebars from 'handlebars'; //шаблон - library
import fs from 'node:fs';
import path from 'node:path'; //шлях
//
import { getEnvVar } from '../utils/getEnvVar.js'; //взаємодія із змінними оточення
import { TEMPLATES_DIR_PATH } from '../constants/path.js'; //шлях до src/templates
import { sendEmail } from '../utils/sendEmail.js'; // надсилання листів

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
  //перевіряємо базу, чи є юзер з таким емейлом
  let user = await UserCollection.findOne({ email: email });
  if (user) {
    throw createHttpError(409, 'Email in use!');
  }

  //хешування паролю
  const hashedPassword = await bcrypt.hash(password, 10); //10 - кількість дій(раундів)
  user = await UserCollection.create({ name, email, password: hashedPassword });

  return user;
};

//LOGIN
export const loginUser = async ({ email, password }) => {
  //перевіряємо базу, чи є юзер з таким емейлом
  const user = await UserCollection.findOne({ email: email });
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
  //отримали сесію
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

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

//LOGOUT - видаляє сесію
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

//читає файл та повертає його вміст за шляхом path //для скиду паролю
const resetEmailTemplate = fs
  .readFileSync(path.join(TEMPLATES_DIR_PATH, 'reset-password-email.html'))
  .toString(); // src/templates/шаблон html листа

//НАДСИЛАННЯ ЛИСТА resetPassword
export const requestResetPasswordEmail = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  //створенн - токен, скидання пароля // jwt - для роботи з токеном (створення)
  const token = jwt.sign(
    { sub: user._id, email }, //для кого генеруємо токен
    getEnvVar(ENV_VARS.JWT_SECRET), //для генерації підпису токену
    {
      expiresIn: '5m',
    }, //термін дії
  );

  //шлях - посилання/назва?токен
  const resetPasswordLink = `${getEnvVar(
    ENV_VARS.FRONTEND_DOMAIN,
  )}/reset-password?token=${token}`;

  //шаблон
  const template = Handlebars.compile(resetEmailTemplate);
  const html = template({
    name: user.name,
    link: resetPasswordLink,
  });

  // sendEmail - надсилання листів
  await sendEmail({
    from: getEnvVar(ENV_VARS.SMTP_FROM),
    to: email,
    subject: 'Reset your password!',
    html,
    // html: `<p>Click <a href="${token}">here</a> to reset your password!</p>`,
  });
};

//ВСТАНОВЛЕННЯ НОВОГО ПАРОЛЮ ЗА ТОКЕНОМ
export const resetPassword = async ({ password, token }, sessionId) => {
  let payload;

  //чи валідний токен, через jwt.verify
  try {
    payload = jwt.verify(token, getEnvVar(ENV_VARS.JWT_SECRET));
  } catch (err) {
    console.error(err.message);
    throw createHttpError(401, 'Token is expired or invalid.');
  }
  console.log('PAYLOAD', payload); //sub, email, iat, exp

  const user = await UserCollection.findById(payload.sub);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  //хешуємо пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  //замінюємо на ноий пароль, знаходимо користувача по id
  await UserCollection.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });

  //видаляємо поточну сесію користувача
  logoutUser(sessionId);
};
