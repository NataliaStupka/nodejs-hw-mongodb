// node --version
// node src/index.js

Налаштування:

1. **npm init -y** //ініціалізуємо проект;
2. **eslint** //Лінтінг коду відповідно до стандарту:
   npm init @eslint/config@latest;
3. ???? **.editorconfig** //послідовні стилі форматування коду в різних редакторах і середовищах;
4. **.gitignore**;
5. **.prettierrc**;
6. **?????** eslint.config.mjs (.js/.cjs) ЧИ ЗМІНЮВАТИ ЯК У КОНСПЕКТІ;
7. **nodemon** як залежність:
   npm install --save-dev nodemon //автоматично перезапускає сервер після змін;
   скрипт у package.json:
   "scripts": {
   "dev": "nodemon src/index.js"
   };
   запускає додаток командою npm run dev
8. папка src ->

   - index.js
   - файл server.js //логіка роботи express-серверу;

<!-- ----- -->

9. npm install express (**Express** - обробка запитів, роутінг(визначення маршрутів), middleware, сервіси статичних файлів, ...):
   import express from 'express';
   const app = express(); //Ініціалізація Express-додаток (сервер);
   9.1. запуск сервера - метод сервера listen
