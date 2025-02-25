//функціонал збереження файлів/картинок на облаці

import cloudinary from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';
import { ENV_VARS } from '../constants/env.js';
import createHttpError from 'http-errors';
import fs from 'node:fs/promises';

//https://cloudinary.com/documentation/node_integration
cloudinary.config({
  cloud_name: getEnvVar(ENV_VARS.CLOUDINARY_CLOUD_NAME),
  api_key: getEnvVar(ENV_VARS.CLOUDINARY_API_KEY),
  api_secret: getEnvVar(ENV_VARS.CLOUDINARY_API_SECRET),
});

//приймає файл і повертають шлях
export const saveFileToCloudinary = async (file) => {
  // console.log('======= Save_File-file =', file);
  try {
    const response = await cloudinary.v2.uploader.upload(file.path);
    // console.log('======= response.secure_url =', response.secure_url);
    return response.secure_url;
  } catch (err) {
    console.log(err);
    throw createHttpError(500, 'Failed to upload an image to cloudinary');
  } finally {
    console.log('File.path_aveFileToCloudinary:', file.path);
    await fs.unlink(file.path); //видаляємо з temp
  }
};
