import { getForgotPasswordUrl } from '@mentorApi/endPoints';
import IApiResponse from '@mentorApi/model/viewModel/apiResponseVm';

export async function forgotPassword(email: string): Promise<IApiResponse<string> | null> {
  const emailDto = { email };
  try {
    const response = await fetch(getForgotPasswordUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailDto)
    });

    const data = await response.json();

    return data as IApiResponse<string>;
  } catch (error) {
    console.error(error);
    return null;
  }
}