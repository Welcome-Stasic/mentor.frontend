import IApiResponse from '@mentorApi/model/viewModel/apiResponseVm';
import { registerDto } from '../model/dto/registerDto';
import { getRegisterUrl } from '../endPoints';

export async function authRegister(dto: registerDto): Promise<IApiResponse<string> | null> {
  try {
    const response = await fetch(getRegisterUrl(), {
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