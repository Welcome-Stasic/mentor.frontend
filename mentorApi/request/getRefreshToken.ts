import IApiResponse from '@mentorApi/model/viewModel/apiResponseVm';
import { getRefreshTokenUrl } from '../endPoints';

export async function getRefreshToken(): Promise<IApiResponse<string> | null> {
  try {
    const response = await fetch(getRefreshTokenUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return data as IApiResponse<string>;
  } catch (error) {
    console.error(error);
    return null;
  }
}