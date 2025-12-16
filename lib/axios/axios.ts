import axios, { AxiosError } from 'axios';
import { IApiResponse } from './types/base';

const API_VERSION = 'v1';
export const BASE_URL = 'https://developmentmentor.eriskip.com:5443';
//export const BASE_URL = 'https://localhost:44330';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Унифицированная обработка ответов
axiosInstance.interceptors.response.use(
  (response) => response, // Успешный ответ — просто возвращаем
  (error: AxiosError<IApiResponse<unknown>>) => {
    if (error.response?.data) {
      // Ошибка от сервера в формате IApiResponse — возвращаем как успешный .data
      return Promise.resolve({ data: error.response.data });
    }

    // Нет ответа от сервера или не IApiResponse
    const fallbackResponse: IApiResponse<null> = {
      Result: null,
      Message: 'Произошла ошибка соединения с сервером',
      Errors: [],
      StatusCode: 500,
      Timestamp: new Date().toISOString(),
      userToken: undefined
    };

    return Promise.resolve({ data: fallbackResponse });
  },
);

export default axiosInstance;
