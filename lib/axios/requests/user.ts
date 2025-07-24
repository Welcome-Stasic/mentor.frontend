import { DateTime } from "luxon";
import { getAuthAxios } from "../authAxios";
import { USER, USER_CRM, USER_GET_REFERRAL_LINK, USER_GET_TIME_REPORT, USER_ME_UPDATE_PHOTO, USER_PHOTO_INFO } from "../endpoint";
import { IApiResponse } from "../types/base";
import { IReportTime } from "../types/time";
import { IApplicationUser, ICrmUser, IUserPhoto, IUserRefLink } from "../types/user";

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

export async function getReportTime(userId: string, dateIn: Date, dateOut: Date, token: string): Promise<IApiResponse<IReportTime> | null> {
  if(!token || !userId) return null;
  
  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IReportTime>>(`${USER_GET_TIME_REPORT}/${userId}?dateIn=${dateIn.toJSON()}&dateOut=${dateOut.toJSON()}`);
console.log(`${USER_GET_TIME_REPORT}/${userId}?dateIn=${dateIn.toJSON()}}&dateOut=${dateOut.toJSON()}}`);
  return res.data;
}