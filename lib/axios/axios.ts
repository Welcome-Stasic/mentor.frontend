import axios from 'axios';

const API_VERSION = 'v1';
const BASE_URL = 'https://developmentmentor.eriskip.com';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;