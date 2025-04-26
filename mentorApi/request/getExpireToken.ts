import { getExpireTokenUrl } from '@mentorApi/endPoints';
import IApiResponse from '@mentorApi/model/viewModel/apiResponseVm';
import { IExpireTokenVm } from '@mentorApi/model/viewModel/expireTokenVm';

export async function getExpireToken(
  token: string,
): Promise<IApiResponse<IExpireTokenVm> | null> {
  if (!token) return null;

  try {
    const response = await fetch(getExpireTokenUrl(token), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return data as IApiResponse<IExpireTokenVm>;
  } catch (error) {
    console.error(error);
    return null;
  }
}
