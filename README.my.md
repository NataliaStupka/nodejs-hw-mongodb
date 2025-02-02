розібратися: з помилками, http-errors !!!!!; Mongoose; MongoDB

<!-- 4 module - hw4-validation -->

1.  Validation:
    npm i joi

    - схема валідації через joi () - створення/оновлення контакту
      // src/validation/contact.js

    - Middleware - валідація для роутів
      // src/middlewares/validateBody.js

      - validateBody(схема) - повертає middleware для валідації body запиту;
      - isValidId - застосувати її в усіх роутах, які працюють з id студента

    - додати у роути валідацію
      // src/routers/students.js

2.  Пагінація:

<!-- 3 module - hw3-crud -->

1.  створюємо folder:

    - routers(/contacts.js); router.get()
    - controllers(/contacts.js); res.status(200)
    - middlewares(errorHandler.js , notFoundHandler.js);

1.  організовуємо роутінг:

        - код роутів з src/server.js до файлу src/routers/contacts.js;
        - код контролерів з src/routers до файлу src/controllers/contacts.js;

1.  Покращення обробки помилок ( http-errors ): npm install http-errors:
    - src/controllers/students.js;
    - src/middlewares/errorHandler.js - додаємо можливість працювати з помилками;
1.  обробки помилок в middleware:

        - errorHandler.js //status(500)
        - notFoundHandler.js //status(404)
        - імпортуємо в server

1.  **???? ctrlWrapper.js**

    <!--  -->
    <!-- Запити, POST, PUT, PATCH, DELETE -->

    **controllers - routers - services**

1.  POST
    //метод: Model.create(doc) Для створення нового документа
1.  PATCH
    //метод: Model.findOneAndUpdate(query, update, options, callback) Для оновлення документа в колекції
1.  DELETE
    //метод: Model.findOneAndDelete(filter, options, callback)

<!-- 2 module - hw2-mongodb-->

// node --version
// node src/index.js

Налаштування:

1. **npm init -y** //ініціалізуємо проект;
2. в package.json: "type": "module",
3. **eslint** //Лінтінг коду відповідно до стандарту:
   npm init @eslint/config@latest;
4. **.editorconfig** //послідовні стилі форматування коду в різних редакторах і середовищах;
5. **.gitignore**;
6. **.prettierrc**;
7. **?????** eslint.config.mjs (.js/.cjs) ЧИ ЗМІНЮВАТИ ЯК У КОНСПЕКТІ;
8. **nodemon** як залежність:
   npm install --save-dev nodemon //автоматично перезапускає сервер після змін;
   скрипт у package.json:
   "scripts": {
   "dev": "nodemon src/index.js"
   };
   запускає додаток командою npm run dev
9. папка src ->

   - index.js
   - файл server.js //логіка роботи express-серверу;

<!-- ----- -->

10. npm install express (**Express** - обробка запитів, роутінг(визначення маршрутів), middleware, сервіси статичних файлів, ...):
    import express from 'express';
    const app = express(); //Ініціалізація Express-додаток (сервер);
    10.1. запуск сервера - метод сервера listen
11. **middleware** (наприклад для обробки запитів без маршруту, помилки). метод use
    app.use(paths, middleware) //шлях, middleware
12. middleware з бібліотеки **pino** - налаштовувати логгер через об’єкт властивостей.
    npm install pino-http //логер
    npm i --save-dev pino-pretty //форматування логів, в 'зрозумілому' вигляді

    import pino from 'pino-http'; //логування

    <!-- CORS -->

13. **CORS** - інструмент безпеки для веб-додатків. Налаштовуємо відповідні HTTP-заголовки, які вказують, яким джерелам дозволено отримувати доступ.
    npm i cors // встановлює пакет cors
    import cors from 'cors';
    app.use(cors());

    <!-- Змінні отчення -->

14. Змінні отчення **.env** - зберігання конфігураційних параметрів, схованих ключів, шляхів до файлів, налаштувань серверів та іншої конфіденційної інформації.
    !!!! .env одразу доданий в .gitignore
    13.1. .env.example - містить всі необхідні назви змінних оточення без реальних значень
15. npm install dotenv - зчитувати та використовувати змінні оточення в додатку;
    import 'dotenv/config'; або import dotenv from "dotenv"; ???
    dotenv.config();

    15.1. Для доступу до змінних оточення в середовищі Node.js використовується глобальний об'єкт **process.env**

16. при відсутності змінної оточення, створити утилітарну функцію яка перевірятиме її наявність і генеруватиме помилку, якщо змінна не встановлена:
    src/utils/getEnvVar.js:
    import dotenv from 'dotenv';
    dotenv.config();
    export function getEnvVar(name, defaultValue) {}

    <!-- MongoDB -->

17. в .env, .env.example оформити connection string

18. **Mongoose** — це бібліотека для роботи з MongoDB у середовищі Node.js.
    моделювання та валідації даних для MongoDB:

        npm install mongoose
        // src/db/initMongoDB.js
        import mongoose from 'mongoose';

19. cтворили кластер в **MongoDB Atlas**:
    - NetworkAcces;
    - Database Access - користувач який має доступ;
    - Clusters -> Connect -> Compass (Copy the connection string ). вставляємо в MongoDb Compass
20. //встановлюємо **MongoDB Compass**
    Імпорт даних в MongoDB.
    Mongo Compass - графічний інтерфейс для роботи з MongoDB (взаємодія з базою даних);
    - Connections + -> вставляємо в URI (з паролем)
    - Authenion -> пароль
    - Save & Conect
21. MongoDB Compass створюємо базу даних;
    - Cluster + -> Database Name, Collection Name
    - Add Data -> import JSON
22. Shema - для даних з беканду потрібно зробити Shema
23. все що стосується серверу виносимо в окрему папку

<!-- Файлова структура застосунку -->

- Файлова структура застосунку:
  - ✅ constants - константі значення нашого застосунку
  - ✅ ✅ controllers - контролери
  - ✅ db - усе, що повʼязане із базою
  - ✅ ✅ middlewares - кастомні мідлвари
  - ✅ ✅ routers - express-роутери, які будуть використані в застосунку
  - ✅ services - основне місце, де ми будемо прописувати логіку
  - templates - шаблони для email
  - ✅ utils - різні функції, які допомагатимуть нам робити певні перетворення чи маніпуляції
  - validation - валідаційні схеми
  - ✅ index.js - файл, з якого буде починатися виконання нашої програми
  - ✅ server.js - файл, де ми опишемо наш express-сервер

✅ - створено у 2 модулі
✅ ✅ - створено у 3 модулі

<!-- POST -->

routers/contact - controllers/contact - services/contact -
