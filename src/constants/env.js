export const ENV_VARS = {
  PORT: 'PORT',
};

//sessions
//export const ACCESS_TOKEN = 1000; //для тесту, при не робочому токену
export const ACCESS_TOKEN = 15 * 60 * 1000; //15 minutes
export const REFRESH_TOKEN = 24 * 60 * 60 * 30 * 1000; // 30 days
