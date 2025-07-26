import { getAuthAxios } from '../authAxios';
import { IApiResponse } from '../types/base';
import { IUpdateTimeDto, IWorkTime } from '../types/time';
import { TIME_UPDATE } from './../endpoint';

export async function updateTime(payload: IUpdateTimeDto, token: string): Promise<IApiResponse<IWorkTime> | null> {
  if(!token) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.post<IApiResponse<IWorkTime>>(TIME_UPDATE, payload);

  return res.data;
}