//створюємо об'єктом, а не строкою

//перенести MONGODB ???
export const ENV_VARS = {
  PORT: 'PORT',
  //скидання паролю
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
  JWT_SECRET: 'JWT_SECRET',

  FRONTEND_DOMAIN: 'FRONTEND_DOMAIN', //адреса куди переправляє лист
  BACKEND_DOMAIN: 'BACKEND_DOMAIN',

  CLOUDINARY_CLOUD_NAME: 'CLOUDINARY_CLOUD_NAME',
  CLOUDINARY_API_KEY: 'CLOUDINARY_API_KEY',
  CLOUDINARY_API_SECRET: 'CLOUDINARY_API_SECRET',

  SAVE_FILE_STRATEGY: 'SAVE_FILE_STRATEGY',
};

//?????? перенести в окремий файл
//sessions
//export const ACCESS_TOKEN = 1000; //для тесту, при не робочому токену
export const ACCESS_TOKEN = 15 * 60 * 1000; //15 minutes
export const REFRESH_TOKEN = 24 * 60 * 60 * 30 * 1000; // 30 days
