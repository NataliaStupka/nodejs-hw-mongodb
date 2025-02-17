розібратися: з помилками, http-errors !!!!!; Mongoose; MongoDB; Promise.all and other

<!-- 5 module - hw4-validation -->

    <!-- 5 module - hw5-authenticate -->
    Авторизація, не відповідає REST, а використовує методи post

1.  Aутентифікації (на основі логіну, паролю) - вхід в систему

    авторизовані запити за допомогою хедера Authorization Bear <token>

    1.1. auth-user
    **Реїстрація:**

        - створюємо сутність user (models/user.js)
        - validation (validation/user.js)
        - створення user (services/auth.js)
        - controllers/auth - для register
        - шлях auth (routes/auth.js) - authRouter
        - routers/index.js (перенести сюди роути contacts і auth),
          редагувати шляхи у routes/contacts, оновити підключення роутів до сервера через routes/index.js
        - validation/registerUser.js
        - обробити помилки (middlewar/errorHandler)
          1.2. - кешування паролю **npm i bcrypt** - прибрати поле з паролем при відповіді
          //
          userSchema.methods.toJSON = function () {
          const obj = this.toObject();
          delete obj.password;
          return obj;
          };
          //або обгортка що віддаємо на фронтенд
          створитит utils/serializeUser.js, обгортаємо створеною функцією user в controllers/user

2.  **Login**

    - services/auth - router/auth;
    - controller/auth;
    - схема валідації (validation/login);
    - routers/auth;

3.  **session** в login-user

    - models/session.js;
    - у файл констант нові константи
    - services/auth.js

4.  cookies **npm i cookie-parser**
    метод .cookie

    - server.js;
    - controllers/auth.js (login)

5.  **logout**
    треба очистити cookies (лише сервер може це зробити, оскільки вони httpOnly), а також видалити сесію із бази даних:

    - services/auth.js;
    - controllers/auth.js
      res.clearCookie - очищає кукі
    - routers/auth.js;

6.  **refresh**
    стару сесію видалити, нову створити, якщо токен вже просрочений то відправити на логінізацію
    - controller
    - router
7.  при видаленні **accessToken**, перевіряємо доступи в midlewar

                - (authenticate.js) - routers/contact (contactsRouter.use('/', authentificate)) - якщо user не залогінений то при get запиті контакти не відправляться.
                - Postman: auth/login (беремо токен) - contact/get_all (в хедер Bearer 'вставляемо токен' ) = отримуємо контакти;
                  Authorization - Bearer 'token'(той що при auth/login) (postman/header на get запиті)

            \*. Налаштування вставлення токену в get запит в postman: login/Scripts:

        //
        const jsonData = pm.response.json();
        pm.environment.set('access_token', jsonData.data.accessToken)
        //
        Environment, Local - Variable: access_token;
        Colections/getContact/Auth - AuthType (BearerToken), Token ({{access_token}})

 <!-- 4 module - hw4-validation -->

        <!-- 4 module - hw4-validation -->

8.  Validation:
    npm i joi

    - схема валідації через joi () - створення/оновлення контакту
      // src/validation/contact.js

    - Middleware - валідація для роутів
      // src/middlewares/validateBody.js

      - validateBody(схема) - повертає middleware для валідації body запиту;
      - isValidId - застосувати її в усіх роутах, які працюють з id студента

    - додати у роути валідацію
      // src/routers/students.js

9.  Пагінація:
    2.1. Створення:

         - логіка парсингу параметрів пошуку (page - сторінка, perPage - скільки на сторінці)
           // src/utils/parsePaginationParams.js
         - page, perPage додати в getStudentsController
           // src/controllers/students.js
         - calculatePaginationData - повертає об'єкт з повною інформацією про пагінацію
           // src/utils/calculatePaginationData.js
         - додати до сервісу логіку для того, щоб правильно запитувати дані з бази даних
           // src/.../services/students.js

    - .limit() - скільки хочемо повернути;
    - .skip() - скільки пропустити/відступити

10. Сортування: sortBy - по чому, sortOrder - порядок (ascendants)↑, (descendants)↓
    - .sort()
11. Фільтрація
    з фільтрами буде базовий query
    фільтр впливає на загальну кількість контактів
    gte - більше/дорівнює
    lte - менше
    equals - для строки, буля

- merge -

5.  !!! глобальний клас **Promise** - можливість паралельно запускати два проміса

- Promise.all
- Promise.allset

<!-- 3 module - hw3-crud -->

1.  створюємо folder:

    - routers(/contacts.js); router.get()
    - controllers(/contacts.js); res.status(200)
    - middlewares(errorHandler.js , notFoundHandler.js);

2.  організовуємо роутінг:

        - код роутів з src/server.js до файлу src/routers/contacts.js;
        - код контролерів з src/routers до файлу src/controllers/contacts.js;

3.  Покращення обробки помилок ( http-errors ): npm install http-errors:
    - src/controllers/students.js;
    - src/middlewares/errorHandler.js - додаємо можливість працювати з помилками;
4.  обробки помилок в middleware:

        - errorHandler.js //status(500)
        - notFoundHandler.js //status(404)
        - імпортуємо в server

5.  **???? ctrlWrapper.js**

    <!--  -->
    <!-- Запити, POST, PUT, PATCH, DELETE -->

    **controllers - routers - services**

6.  POST
    //метод: Model.create(doc) Для створення нового документа
7.  PATCH
    //метод: Model.findOneAndUpdate(query, update, options, callback) Для оновлення документа в колекції
8.  DELETE
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
