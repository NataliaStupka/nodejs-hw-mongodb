//Підключення до бази даних, кластер(створена база даних) в mongodb

import mongoose from 'mongoose'; //бібліотека для роботи з MongoDB у Node.js
import { getEnvVar } from '../utils/getEnvVar.js'; //змінні оточення

//встановлення зʼєднання
export const initMongoConnection = async () => {
  //приєднуємось до бази даних в try
  // використаємо утилітарну функцію env, яка забезпечує доступ до змінних оточення.
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    const conectionURI = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0"`;

    await mongoose.connect(conectionURI); //(connection string)
    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.error('Error while setting up mongo connection', err);
    process.exit(1); //закінчуємо процес і виходимо з кодом 1
  }
};
