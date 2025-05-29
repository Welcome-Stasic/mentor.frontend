import { getCrmLoginUrl } from '@mentorApi/endPoints';
import { loginDto } from '@mentorApi/model/dto/loginDto';
import IApiResponse from '@mentorApi/model/viewModel/apiResponseVm';

export async function authCrmLogin(dto: loginDto): Promise<IApiResponse<string> | null> {
  try {
    const response = await fetch(getCrmLoginUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(dto)
    });

    const data = await response.json();

    return data as IApiResponse<string>;
  } catch (error) {
    console.error(error);
    return null;
  }
}