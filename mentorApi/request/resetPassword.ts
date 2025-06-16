import IApiResponse from '@mentorApi/model/viewModel/apiResponseVm';
import { getResetPasswordUrl } from '../endPoints';
import { resetPasswordDto } from '../model/dto/resetPasswordDto';

export async function resetPassword(dto: resetPasswordDto): Promise<IApiResponse<boolean> | null> {
  try {
    const response = await fetch(getResetPasswordUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto)
    });

    const data = await response.json();

    return data as IApiResponse<boolean>;
  } catch (error) {
    console.error(error);
    return null;
  }
}