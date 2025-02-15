import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js'; //база данних MongoDB

await initMongoConnection();
setupServer();

// //ініціалізація підключення до бази даних
// const bootstrap = async () => {
//   await initMongoConnection(); //підключення до бази даних в MONGODB

//   setupServer(); //запуск сервера
// };

// bootstrap();
