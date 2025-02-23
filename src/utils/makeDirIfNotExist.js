//при запуску застосунку створює папку якщо вона не існує

import fs from 'fs/promises';

export const createDirIfNotExist = async (path) => {
  try {
    //чи є щось по даному шляху
    await fs.access(path);
  } catch (err) {
    console.log(err);
    if (err.code === 'ENOENT') {
      await fs.mkdir(path);
    }
  }
};
