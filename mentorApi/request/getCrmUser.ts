import IApiResponse from '@mentorApi/model/viewModel/apiResponseVm';
import { getCookie } from 'cookies-next';
import { getCrmUserUrl } from '../endPoints';
import { ICrmUserVm } from '../model/viewModel/crmUserVm';

export async function getCrmUser(userId: string): Promise<IApiResponse<ICrmUserVm> | null> {
  const token = getCookie('token');
 
  if(!token) return null;
 
  try {
    const response = await fetch(getCrmUserUrl(userId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });

    const data = await response.json();

    return data as IApiResponse<ICrmUserVm>;
  } catch (error) {
    console.error(error);
    return null;
  }
}
