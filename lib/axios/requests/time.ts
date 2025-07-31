import { getAuthAxios } from '../authAxios';
import { IApiResponse } from '../types/base';
import { IApproveTime, IApproveTimeDto, ICancelApproveTimeDto, ICreateTimeDto, IDeleteTimeDto, IGetApproveTimeDto, IUpdateTimeDto, IWorkTime } from '../types/time';
import { TIME_APPROVE_TIME, TIME_CANCEL_APPROVE_TIME, TIME_CREATE, TIME_DELETE, TIME_GET_APPROVE_TIME_INFO, TIME_UPDATE } from './../endpoint';

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

export async function cancelApproveTime(payload: ICancelApproveTimeDto, token: string): Promise<IApiResponse<boolean> | null> {
  if(!token) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.post<IApiResponse<boolean>>(TIME_CANCEL_APPROVE_TIME, payload);

  return res.data;
}

export async function approveTime(payload: IApproveTimeDto, token: string): Promise<IApiResponse<boolean> | null> {
  if(!token) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.post<IApiResponse<boolean>>(TIME_APPROVE_TIME, payload);

  return res.data;
}

export async function getApproveTimeInfo(params: IGetApproveTimeDto, token: string): Promise<IApiResponse<IApproveTime> | null> {
  if(!token) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IApproveTime>>(TIME_GET_APPROVE_TIME_INFO, { params });

  return res.data;
}