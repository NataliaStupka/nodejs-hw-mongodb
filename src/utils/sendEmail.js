//send a letter

import nodemailer from 'nodemailer'; //надсилання листів.
import createHttpError from 'http-errors';
import { getEnvVar } from './getEnvVar.js'; //зчитування змінних оточення
import { ENV_VARS } from '../constants/env.js';

// createTransport - до якого сервісу посилаємо повідомлення
const transporter = nodemailer.createTransport({
  host: getEnvVar(ENV_VARS.SMTP_HOST),
  port: Number(getEnvVar(ENV_VARS.SMTP_PORT)),
  auth: {
    user: getEnvVar(ENV_VARS.SMTP_USER),
    pass: getEnvVar(ENV_VARS.SMTP_PASSWORD),
  },
});

// option - {to (отримувач), subject, html, from, ...}
export const sendEmail = async (options) => {
  //пробуємо надіслати email
  try {
    return await transporter.sendMail({
      to: options.to,
      subject: options.subject,
      from: options.from,
      html: options.html,
    });
  } catch (err) {
    console.error(err);
    return createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};
