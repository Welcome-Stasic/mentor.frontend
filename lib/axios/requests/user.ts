import { DateTime } from 'luxon';
import { getAuthAxios } from '../authAxios';
import {
  ADMIN_DELETE_USER,
  ADMIN_LOG_OUT_USER,
  USER,
  USER_ASSIGN_ROLE,
  USER_BINDING_TO_CRM,
  USER_CRM,
  USER_CRM_ALL,
  USER_GET_ALL,
  USER_GET_ALL_JUNIORS,
  USER_GET_JUNIORS,
  USER_GET_MENTOR,
  USER_GET_REFERRAL_LINK,
  USER_GET_ROLES,
  USER_GET_TIME_REPORT,
  USER_GET_TIME_Work,
  USER_ME_UPDATE_PHOTO,
  USER_PHOTO_INFO,
  USER_REMOVE_ROLE,
  USER_UPDATE_EMAIL,
  USER_GET_JUNIORSOLD
} from '../endpoint';
import { IApiResponse, IPaginationResponse } from '../types/base';
import { IReportTime, IWorkTime } from '../types/time';
import {
  IApplicationUser,
  IAssignRoleDto,
  IBindingToCrmDto,
  ICrmUser,
  ICrmUserVm,
  IGetAllJuniorsDto,
  IJunior,
  IMentor,
  IUpdateUserEmailDto,
  IUserPhoto,
  IUserRefLink,
} from '../types/user';

export async function getCrmUserById(
  crmUserId: string,
  token: string,
): Promise<IApiResponse<ICrmUser> | null> {
  try {
    if (!token) return null;

    const authAxios = await getAuthAxios(token);
    const res = await authAxios.get<IApiResponse<ICrmUser>>(`${USER_CRM}/${crmUserId}`);

    return res.data as IApiResponse<ICrmUser>;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserById(
  userId: string,
  token: string,
): Promise<IApiResponse<IApplicationUser> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IApplicationUser>>(`${USER}/${userId}`);

  return res.data;
}

export async function updatePhotoCurrentUser(
  file: File,
  token: string,
): Promise<IApiResponse<string> | null> {
  if (!token || !file) return null;

  const formData = new FormData();

  formData.append('photo', file);

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.put<IApiResponse<string>>(USER_ME_UPDATE_PHOTO, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}

export async function getUserPhoto(
  userId: string,
  token: string,
): Promise<IApiResponse<IUserPhoto> | null> {
  if (!token || !userId) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IUserPhoto>>(`${USER_PHOTO_INFO}/${userId}`);

  return res.data;
}

export async function getReferralLink(
  userId: string,
  token: string,
): Promise<IApiResponse<IUserRefLink> | null> {
  if (!token || !userId) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IUserRefLink>>(
    `${USER_GET_REFERRAL_LINK}/${userId}`,
  );

  return res.data;
}

export async function getReportTime(
  userId: string,
  token: string,
  dateIn?: string,
  dateOut?: string,
): Promise<IApiResponse<IReportTime> | null> {
  if (!token || !userId) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IReportTime>>(
    `${USER_GET_TIME_REPORT}/${userId}?dateIn=${dateIn}&dateOut=${dateOut}`,
  );

  return res.data;
}

export async function getWorkTime(
  userId: string,
  token: string,
  dateIn?: string,
  dateOut?: string,
): Promise<IApiResponse<IWorkTime[]> | null> {
  if (!token || !userId) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IWorkTime[]>>(
    `${USER_GET_TIME_Work}/${userId}?dateIn=${dateIn}&dateOut=${dateOut}`,
  );

  return res.data;
}

export async function getJuniors(
  userId: string,
  token: string,
): Promise<IApiResponse<IJunior[]> | null> {
  if (!token || !userId) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IJunior[]>>(`${USER_GET_JUNIORS}/${userId}`);

  return res.data;
}
export async function getJuniorsOld(
  userId: string,
  token: string,
): Promise<IApiResponse<IJunior[]> | null> {
  if (!token || !userId) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IJunior[]>>(`${USER_GET_JUNIORSOLD}/${userId}`);

  return res.data;
}

export async function getAllJuniors(
  params: IGetAllJuniorsDto,
  token: string,
): Promise<IApiResponse<IJunior[]> | null> {
  if (!token) return null;

  const { includeOnly, userIds } = params;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IJunior[]>>(USER_GET_ALL_JUNIORS, {
    params: {
      includeOnly,
      userIds: userIds.join(','),
    },
  });

  return res.data;
}

export async function getMentor(
  userId: string,
  token: string,
): Promise<IApiResponse<IMentor> | null> {
  if (!token || !userId) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<IMentor>>(`${USER_GET_MENTOR}/${userId}`);

  return res.data;
}

export async function getAllUsers(
  token: string,
  params: {
    pageNumber?: number;
    pageSize?: number;
    sortColumn?: string;
    sortDirection?: string;
    search?: string;
    includeOnly?: boolean;
    userIds?: string[];
  } = {},
): Promise<IApiResponse<IPaginationResponse<IApplicationUser>> | null> {
  try {
    if (!token) return null;

    const authAxios = await getAuthAxios(token);
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const res = await authAxios.get<IApiResponse<IPaginationResponse<IApplicationUser>>>(
      `${USER_GET_ALL}?${searchParams.toString()}`,
    );

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteUser(
  userId: string,
  token: string,
): Promise<IApiResponse<boolean> | null> {
  if (!token || !userId) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.delete<IApiResponse<boolean>>(`${ADMIN_DELETE_USER}/${userId}`);

  return res.data;
}

export async function getUserRoles(
  userId: string,
  token: string,
): Promise<IApiResponse<string[]> | null> {
  if (!token || !userId) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<string[]>>(`${USER_GET_ROLES}/${userId}`);

  return res.data;
}

export async function assignUserRole(
  payload: IAssignRoleDto,
  token: string,
): Promise<IApiResponse<boolean> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.post<IApiResponse<boolean>>(USER_ASSIGN_ROLE, payload);

  return res.data;
}

export async function removeUserRole(
  payload: IAssignRoleDto,
  token: string,
): Promise<IApiResponse<boolean> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.post<IApiResponse<boolean>>(USER_REMOVE_ROLE, payload);

  return res.data;
}

export async function allLogOutUser(
  id: string,
  token: string,
): Promise<IApiResponse<boolean> | null> {
  if (!token || !id) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<boolean>>(`${ADMIN_LOG_OUT_USER}/${id}`);

  return res.data;
}

export async function getAllCrmUsers(token: string): Promise<IApiResponse<ICrmUserVm[]> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.get<IApiResponse<ICrmUserVm[]>>(USER_CRM_ALL);

  return res.data;
}

export async function bindingToCrm(
  payload: IBindingToCrmDto,
  token: string,
): Promise<IApiResponse<boolean> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.post<IApiResponse<boolean>>(USER_BINDING_TO_CRM, payload);

  return res.data;
}

export async function updateEmail(
  payload: IUpdateUserEmailDto,
  token: string,
): Promise<IApiResponse<IApplicationUser> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);
  const res = await authAxios.post<IApiResponse<IApplicationUser>>(USER_UPDATE_EMAIL, payload);

  return res.data;
}
