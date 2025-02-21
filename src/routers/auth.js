import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; //обгортка try/catch
import { validateBody } from '../middlewares/validateBody.js';

import { registerUserSchema } from '../validation/registerUser.js'; //схема валідациї
import {
  registerUserController,
  loginUserController,
  refreshSessionController,
  logoutUserController,
  requestResetPasswordEmailController,
} from '../controllers/auth.js'; //res.status(201).json();
import { loginUserValidationSchema } from '../validation/loginUserValidationSchema.js'; //login
//скид паролю
import { requestResetEmailSchema } from '../validation/requestResetEmailSchema.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
  '/login',
  validateBody(loginUserValidationSchema),
  ctrlWrapper(loginUserController),
);
authRouter.post('/refresh', ctrlWrapper(refreshSessionController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));

//sendEmail to resetPassword
authRouter.post(
  '/request-reset-password-email',
  validateBody(requestResetEmailSchema), //потрібен лише email
  ctrlWrapper(requestResetPasswordEmailController),
);

export default authRouter;
