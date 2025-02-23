import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetPasswordEmail, //надсилання листа на зміну паролю
  resetPassword,
} from '../services/auth.js'; //створенний користувач
import { serializeUser } from '../utils/serializeUser.js'; //схема об'єкту, що повертаємо при response

import { REFRESH_TOKEN } from '../constants/env.js';

//для перевикористання: налаштування
const setupSessionCookies = (session, res) => {
  //cookie(name, value, options)
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true, //доступний тільки через HTTP-запити
    expires: new Date(Date.now() + REFRESH_TOKEN), //термін дії 30 днів
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN),
  });
};

//REGISTER
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: serializeUser(user), //повертаємо без поля password
  });
};

//LOGIN
export const loginUserController = async (req, res) => {
  //виконує процес аутентифікації і повертає об'єкт сесії
  const session = await loginUser(req.body); // req.body - email, password

  //налаштування cookies
  setupSessionCookies(session, res);

  res.status(200).json({
    status: 200,
    message: 'Successfully loged in an user!',
    //data: session, //повертаємо без поля password -  serializeUser(session)
    data: {
      accessToken: session.accessToken,
    },
  });
};

//REFRESH
export const refreshSessionController = async (req, res) => {
  const session = await refreshSession({
    //з cookies беремо sessionId, refreshToken
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  //налаштування cookies
  setupSessionCookies(session, res);

  //повертаємо response з новим token
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    //data: session, //повертаємо без поля password -  serializeUser(session)
    data: {
      accessToken: session.accessToken,
    },
  });
};

//LOGOUT
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    //видаляє сесію user
    await logoutUser(req.cookies.sessionId);
  }

  //очищення куків, вихід user з системи на стороні клієнта
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send(); // 204 (No Content)
};

//НАДСИЛАННЯ ЛИСТА resetPassword
export const requestResetPasswordEmailController = async (req, res) => {
  await requestResetPasswordEmail(req.body.email); //надсилання на email листа на зміну паролю

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

//ЗМІНА ПАРОЛЮ ЗА ТОКЕНОМ
export const resetPasswordController = async (req, res) => {
  const body = req.body;
  const sessionId = req.cookies.sessionId;

  // await resetPassword(req.body);
  await resetPassword(body, sessionId);

  res.json({
    status: 200,
    message: 'Password has been successfully reset!',
    data: {},
  });
};
