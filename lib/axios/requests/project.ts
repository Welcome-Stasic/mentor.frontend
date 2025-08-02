import { getAuthAxios } from "../authAxios";
import { PROJECT_CREATE, PROJECT_DELETE, PROJECT_GET_ALL, PROJECT_UPDATE } from "../endpoint";
import { IApiResponse } from "../types/base";
import { ICreateProjectDto, IProjectVm, IUpdateProjectCommand } from "../types/project";

export async function getAllProjects(userId: string, token: string): Promise<IApiResponse<IProjectVm[]> | null> {
  if(!token || !userId) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IProjectVm[]>>(`${PROJECT_GET_ALL}?userId=${userId}`);

  return res.data;
}

export async function getCreateProject(payload: ICreateProjectDto, token: string): Promise<IApiResponse<string> | null> {
  if(!token || !payload) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.post<IApiResponse<string>>(PROJECT_CREATE, payload);

  return res.data;
}

export async function getUpdateProject(payload: IUpdateProjectCommand, token: string): Promise<IApiResponse<IProjectVm> | null> {
  if(!token || !payload) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.put<IApiResponse<IProjectVm>>(PROJECT_UPDATE, payload);

  return res.data;
}

export async function deleteProject(projectId: string, token: string): Promise<IApiResponse<boolean> | null> {
  if(!token || !projectId) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.delete<IApiResponse<boolean>>(`${PROJECT_DELETE}/${projectId}`);

  return res.data;
}