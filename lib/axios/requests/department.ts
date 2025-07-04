import { getAuthAxios } from '../authAxios';
import { DEPARTMENT_GET_ALL } from '../endpoint';
import { IApiResponse } from '../types/base';
import { IDepartment } from './../types/department';

export async function getDepartmentAll(token: string): Promise<IApiResponse<IDepartment[]> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IDepartment[]>>(`${DEPARTMENT_GET_ALL}`);

  return res.data;
}
