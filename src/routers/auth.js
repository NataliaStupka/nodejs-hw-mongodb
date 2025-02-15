import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; //обгортка try/catch
import { registerUserSchema } from '../validation/registerUser.js'; //схема валідациї
import {
  loginUserController,
  registerUserController,
  refreshSessionController,
  logoutUserController,
} from '../controllers/auth.js'; //res.status(201).json();
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserValidationSchema } from '../validation/loginUserValidationSchema.js'; //login

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
authRouter.post('/refresh-session', ctrlWrapper(refreshSessionController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));

export default authRouter;
