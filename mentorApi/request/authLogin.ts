import { getLoginUrl } from '@mentorApi/endPoints';
import { appLoginDto } from '@mentorApi/model/dto/loginDto';
import IApiResponse from '@mentorApi/model/viewModel/apiResponseVm';

export async function authLogin(dto: appLoginDto): Promise<IApiResponse<string> | null> {
  try {
    const response = await fetch(getLoginUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto)
    });

    const data = await response.json();

    return data as IApiResponse<string>;
  } catch (error) {
    console.error(error);
    return null;
  }
}