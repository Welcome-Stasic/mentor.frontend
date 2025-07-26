import { getAuthAxios } from '../authAxios';
import { IApiResponse } from '../types/base';
import { ICreateTimeDto, IDeleteTimeDto, IUpdateTimeDto, IWorkTime } from '../types/time';
import { TIME_CREATE, TIME_DELETE, TIME_UPDATE } from './../endpoint';

export async function updateTime(payload: IUpdateTimeDto, token: string): Promise<IApiResponse<IWorkTime> | null> {
  if(!token) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.post<IApiResponse<IWorkTime>>(TIME_UPDATE, payload);

  return res.data;
}

export async function createTime(payload: ICreateTimeDto, token: string): Promise<IApiResponse<number> | null> {
  if(!token) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.post<IApiResponse<number>>(TIME_CREATE, payload);

  return res.data;
}

export async function deleteTime(payload: IDeleteTimeDto, token: string): Promise<IApiResponse<boolean> | null> {
  if(!token) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.post<IApiResponse<boolean>>(TIME_DELETE, payload);

  return res.data;
}