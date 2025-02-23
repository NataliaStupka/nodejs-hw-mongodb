import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js'; //база данних MongoDB
import { TEMP_DIR_PATH, UPLOADS_DIR_PATH } from './constants/path.js'; //шлях до src/temp, src/uploads
import { createDirIfNotExist } from './utils/makeDirIfNotExist.js';

//при запуску додатку створює папку якщо її ще не існує
await createDirIfNotExist(TEMP_DIR_PATH);
await createDirIfNotExist(UPLOADS_DIR_PATH);

await initMongoConnection();
setupServer();

// //ініціалізація підключення до бази даних
// const bootstrap = async () => {
//   await initMongoConnection(); //підключення до бази даних в MONGODB
//
// await createDirIfNotExist(TEMP_DIR_PATH);
// await createDirIfNotExist(UPLOADS_DIR_PATH);
//
//   setupServer(); //запуск сервера
// };
//
// void bootstrap();
