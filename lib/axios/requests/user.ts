import { getAuthAxios } from "../authAxios";
import { USER, USER_CRM, USER_ME_UPDATE_PHOTO } from "../endpoint";
import { IApiResponse } from "../types/base";
import { IApplicationUser, ICrmUser } from "../types/user";

export async function getCrmUserById(crmUserId: string, token: string): Promise<IApiResponse<ICrmUser> | null> {
  try {
    if(!token) return null;

    const authAxios = await getAuthAxios(token);
    const res = await authAxios.get<IApiResponse<ICrmUser>>(`${USER_CRM}/${crmUserId}`);

    return res.data as IApiResponse<ICrmUser>;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserById(userId: string, token: string): Promise<IApiResponse<IApplicationUser> | null> {
  if(!token) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IApplicationUser>>(`${USER}/${userId}`);

  return res.data;
}

export async function updatePhotoCurrentUser(file: File, token: string): Promise<IApiResponse<string> | null> {
  if(!token || !file) return null;
  
  const formData = new FormData();

  formData.append('photo', file);

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.put<IApiResponse<string>>(USER_ME_UPDATE_PHOTO, formData, { headers : {
    'Content-Type': 'multipart/form-data'
  }});

  return res.data;
}