import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js'; //база данних MongoDB
import { createDirIfNotExist } from './utils/CreateDirIfNotExist.js';
import { TEMP_DIR_PATH, UPLOADS_DIR_PATH } from './constants/path.js'; //шлях до src/temp, src/uploads

//при запуску додатку створює папку якщо її ще не існує
await createDirIfNotExist(TEMP_DIR_PATH);
await createDirIfNotExist(UPLOADS_DIR_PATH);

await initMongoConnection();
setupServer();

// //ініціалізація підключення до бази даних
// const bootstrap = async () => {
//   await initMongoConnection(); //підключення до бази даних в MONGODB

//   setupServer(); //запуск сервера
// };

// bootstrap();
