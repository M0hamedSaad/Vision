import {BASE_URL} from '@src/utils';
import axios, {AxiosError} from 'axios';

export const request = axios.create({
  baseURL: BASE_URL,
});

request.interceptors.request.use(
  config => {
    config.headers = {
      ...config.headers,
    };

    return config;
  },
  err => {},
);

request.interceptors.response.use(
  res => {
    console.log(
      `%c url: ${res.config.url}`,
      'background: #222; color: #bada55',
      res,
    );
    return res;
  },
  async function (err: AxiosError) {
    console.log(
      `%c ERROR url: ${err.config.url}`,
      'background: #222; color: red',
      err.message,
      err.response,
    );
    throw err;
  },
);
