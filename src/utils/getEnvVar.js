// ініціалізація dotenv
//взаємодія із змінними оточення

import dotenv from 'dotenv'; //зчитування змінних оточення

dotenv.config(); //використовує глобальний об'єкт process.env

//('PORT', '3000') //читання змінних оточення
export function getEnvVar(name, defaultValue) {
  const value = process.env[name]; //змінна оточ. PORT = 3000; MONGODB_USER; MONGODB_PASSWORD: ...

  if (value) return value;
  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
}
