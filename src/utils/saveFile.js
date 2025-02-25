import { saveFileToLocal } from '../utils/saveFileToLocal.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from './getEnvVar.js';
import { ENV_VARS } from '../constants/env.js';
import createHttpError from 'http-errors';

export const saveFile = async (file) => {
  const strategy = getEnvVar(ENV_VARS.SAVE_FILE_STRATEGY);

  if (strategy === 'cloudinary') {
    return await saveFileToCloudinary(file); //зберігання на https://res.cloudinary.com
  }
  if (strategy === 'local') {
    return await saveFileToLocal(file); // зберігання локально
  }

  throw createHttpError(500, 'No file storage trategy set');
};

// fieldname: 'photo',
//   originalname: 'fawn.jpeg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: '/Users/nataliiastupka/Desktop/GoIt/Nodejs/nodejs-hw-mongodb/temp',
//   filename: '1740478816238-fawn.jpeg',
//   path: '/Users/nataliiastupka/Desktop/GoIt/Nodejs/nodejs-hw-mongodb/temp/1740478816238-fawn.jpeg',
//   size: 63984
