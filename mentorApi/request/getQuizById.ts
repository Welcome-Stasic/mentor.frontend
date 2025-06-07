import { getQuizByIdUrl } from '@mentorApi/endPoints';
import IApiResponse from '@mentorApi/model/viewModel/apiResponseVm';
import { getCookie } from 'cookies-next';
import { IQuizVm } from '../model/viewModel/quizVm';

export async function getQuizById(id: string): Promise<IApiResponse<IQuizVm> | null> {
  const token = getCookie('token');

  if(!token) return null;

  try {
    const response = await fetch(getQuizByIdUrl(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });

    const data = await response.json();

    return data as IApiResponse<IQuizVm>;
  } catch (error) {
    console.error(error);
    return null;
  }
}
