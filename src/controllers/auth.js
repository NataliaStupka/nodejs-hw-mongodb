import {
  loginUser,
  registerUser,
  logoutUser,
  refreshSession,
} from '../services/auth.js'; //створенний користувач
import { serializeUser } from '../utils/serializeUser.js'; //схема об'єкту  щ о повертаємо при response

import { REFRESH_TOKEN } from '../constants/env.js';

//для переваикористання: налаштування
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
  //   console.log('BODY_controller-register??:', req.body);
  //   console.log('USER_controller-register??:', user);

  res.status(200).json({
    status: 200,
    message: 'Successfully registered a user!',
    data: serializeUser(user), //повертаємо без поля password
  });
};

//LOGIN
export const loginUserController = async (req, res) => {
  console.log('REQREQ-body:', req.body);

  //виконує процес аутентифікації і повертає об'єкт сесії
  const session = await loginUser(req.body); // req.body - email, password
  console.log('SESSION', session);

  //налаштування cookies
  setupSessionCookies(session, res);
  console.log(
    `Controllers-auth_setupSessionCookies(ses: ${session}, res: ${res})`,
  );

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
  console.log(`Controller-auth_req: ${req}; res: ${res}`);

  const session = await refreshSession({
    //з cookies беремо sessionId, refreshToken
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  console.log('Controller-auth_session', session);

  //налаштування cookies
  setupSessionCookies(session, res);

  console.log('Controlers-auth_RES::', res);
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
