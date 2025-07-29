import { DateTime } from "luxon";
import { getAuthAxios } from "../authAxios";
import { USER, USER_CRM, USER_GET_JUNIORS, USER_GET_MENTOR, USER_GET_REFERRAL_LINK, USER_GET_TIME_REPORT, USER_GET_TIME_Work, USER_ME_UPDATE_PHOTO, USER_PHOTO_INFO } from "../endpoint";
import { IApiResponse } from "../types/base";
import { IReportTime, IWorkTime } from "../types/time";
import { IApplicationUser, ICrmUser, IJunior, IMentor, IUserPhoto, IUserRefLink } from "../types/user";

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

export async function getUserPhoto(userId: string, token: string): Promise<IApiResponse<IUserPhoto> | null> {
  if(!token || !userId) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IUserPhoto>>(`${USER_PHOTO_INFO}/${userId}`);

  return res.data;
}

export async function getReferralLink(userId: string, token: string): Promise<IApiResponse<IUserRefLink> | null> {
  if(!token || !userId) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IUserRefLink>>(`${USER_GET_REFERRAL_LINK}/${userId}`);

  return res.data;
}

export async function getReportTime(userId: string, token: string, dateIn?: string, dateOut?: string): Promise<IApiResponse<IReportTime> | null> {
  console.log(userId, token);

  if(!token || !userId) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IReportTime>>(`${USER_GET_TIME_REPORT}/${userId}?dateIn=${dateIn}&dateOut=${dateOut}`);
  
  return res.data;
}

export async function getWorkTime(userId: string, token: string, dateIn?: string, dateOut?: string): Promise<IApiResponse<IWorkTime[]> | null> {
  if(!token || !userId) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IWorkTime[]>>(`${USER_GET_TIME_Work}/${userId}?dateIn=${dateIn}&dateOut=${dateOut}`);

  return res.data;
}

export async function getJuniors(userId: string, token: string): Promise<IApiResponse<IJunior[]> | null> {
  if(!token || !userId) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IJunior[]>>(`${USER_GET_JUNIORS}/${userId}`);

  return res.data;
}

export async function getMentor(userId: string, token: string): Promise<IApiResponse<IMentor> | null> {
  if(!token || !userId) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IMentor>>(`${USER_GET_MENTOR}/${userId}`);

  return res.data;
}