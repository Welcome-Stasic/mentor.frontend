import { getQuizByIdUrl } from '@mentorApi/endPoints';
import IApiResponse from '@mentorApi/model/viewModel/apiResponseVm';
import { getCookie } from 'cookies-next';
import { IQuizVm } from '../model/viewModel/quizVm';
import { IPaginationResponse } from '../model/viewModel/paginationResponse';

export async function getAllQuiz(applicationUserid: string): Promise<IApiResponse<IPaginationResponse<IQuizVm>> | null> {
  const token = getCookie('token');

  if(!token) return null;

  try {
    const response = await fetch(getQuizByIdUrl(applicationUserid), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });

    const data = await response.json();

    return data as IApiResponse<IPaginationResponse<IQuizVm>>;
  } catch (error) {
    console.error(error);
    return null;
  }
}
