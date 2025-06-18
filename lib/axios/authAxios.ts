import axiosInstance from './axios';

export const getAuthAxios = async (accessToken: string) => {
  const authAxios = axiosInstance;
  authAxios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

  return authAxios;
};
