import { getAuthAxios } from "../authAxios";
import { INSTITUTION_GET_ALL, INSTITUTION } from "../endpoint";
import { IApiResponse } from "../types/base";
import { IInstitution } from "../types/institution";

export async function getAllInstitution(token: string): Promise<IApiResponse<IInstitution[]> | null> {
  if(!token) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IInstitution[]>>(INSTITUTION_GET_ALL);

  return res.data;
}

export async function getByIdInstitution(id: number, token: string): Promise<IApiResponse<IInstitution> | null> {
  if(!token || !id) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IInstitution>>(`${INSTITUTION}/${id}`);

  return res.data;
}