import { getMeUrl } from '@mentorApi/endPoints';
import IApiResponse from '@mentorApi/model/viewModel/apiResponseVm';
import { ICurrentUserVmVm } from '@mentorApi/model/viewModel/currentUserVm';
import { getCookie } from 'cookies-next';

export async function getMe(): Promise<IApiResponse<ICurrentUserVmVm> | null> {
  const token = getCookie('token');

  if(!token) return null;

  try {
    const response = await fetch(getMeUrl(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });

    const data = await response.json();

    return data as IApiResponse<ICurrentUserVmVm>;
  } catch (error) {
    console.error(error);
    return null;
  }
}
