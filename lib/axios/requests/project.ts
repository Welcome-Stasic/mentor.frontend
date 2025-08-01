import { getAuthAxios } from "../authAxios";
import { PROJECT_GET_ALL } from "../endpoint";
import { IApiResponse } from "../types/base";
import { IProjectVm } from "../types/project";

export async function getAllProjects(userId: string, token: string): Promise<IApiResponse<IProjectVm[]> | null> {
  if(!token || !userId) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IProjectVm[]>>(`${PROJECT_GET_ALL}?userId=${userId}`);

  return res.data;
}