//логіка роботи express-серверу
import express from 'express';
import pino from 'pino-http'; //логування
import cors from 'cors'; //безпека

import { getEnvVar } from './utils/getEnvVar.js'; //зчитування змінних оточення
import { getContact, getContactById } from './db/services/contacts.js';

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

  //маршрут для GET-запиту (шлях до ресурсу, функція-обробник)
  // app.get('/contacts', async (req, res) => {
  //   const contacts = await ContactCollection.find();
  //   res.json(contacts);
  //   // res.json({ message: 'Hello Express!' });
  // });

  //контролер
  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getContact();
      // res.json(contacts);
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (err) {
      console.error('Error retrieving contacts', err);
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId); //??

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id: ${contactId}!`,
      data: contact,
    });
  });

  //помилки
  app.use('*', (req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });
  // Middleware для обробких помилки, яку не було передбачено
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  const PORT = Number(getEnvVar('PORT', 3000));
  //listen - Запускає сервер
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
