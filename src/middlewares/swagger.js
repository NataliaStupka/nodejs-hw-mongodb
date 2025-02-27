// import swaggerUi from 'swagger-ui-express';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import createHttpError from 'http-errors';
import { SWAGGER_JSON_PATH } from '../constants/path.js';

export const swaggerDoc = () => {
  try {
    const swaggerDocument = JSON.parse(
      fs.readFileSync(SWAGGER_JSON_PATH).toString(),
    );
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDocument)];
  } catch (err) {
    console.error(err);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load Swagger file"));
  }
};
