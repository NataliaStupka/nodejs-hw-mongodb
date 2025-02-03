//логіка роботи express-серверу
import express from 'express';
import pino from 'pino-http'; //логування
import cors from 'cors'; //безпека

import { getEnvVar } from './utils/getEnvVar.js'; //зчитування змінних оточення

//роутер get(/contacts, /contacts/:contactId)
import contactsRouter from './routers/contacts.js';

// Імпортуємо middleware (помилки)
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

// dotenv.config() - використовує глобальний об'єкт process.env

//setupServer, створює express сервер.
export const setupServer = () => {
  const app = express(); //Ініціалізувати Express-додаток

  //перевіряє, чи дані, які надійшли на сервер, у форматі JSON, і якщо так, розпаковує (парсить) їх.
  app.use(express.json()); // Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
  app.use(cors());

  //логування, в 'зрозумілому' вигляді pino-pretty
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(contactsRouter); //роутер контролерів get(/contacts, /contacts/:contactId)

  //помилки
  app.use('*', notFoundHandler); //status(404)
  app.use(errorHandler); //status(500)

  const PORT = Number(getEnvVar('PORT', 3000));
  //listen - Запускає сервер
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
