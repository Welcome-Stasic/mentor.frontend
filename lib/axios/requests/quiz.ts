import {
  QUIZ,
  QUIZ_ADD_ANSWERS_TO_QUESTIONS,
  QUIZ_ALL,
  QUIZ_CRM_PROCESSING,
  QUIZ_DELETE,
  QUIZ_DOWNLOAD,
  QUIZ_GET_ALL_STATUES,
  QUIZ_GET_ANSWERS_TO_QUESTIONS,
  QUIZ_UPDATE,
  QUIZ_UPDATE_FIRST_STAGE,
} from '../endpoint';
import { IApiResponse, IPaginationResponse } from '../types/base';
import { getAuthAxios } from '../authAxios';
import {
  IAddAnswersToQuestionsDto,
  IAnswerOnQuestion,
  IQuiz,
  IQuizStatus,
  IUpdateFirstStageDto,
  IUpdateQuizDto,
} from '../types/quiz';
import { handleApiError } from '@/lib/utils/handleApiError';
import { saveAs } from 'file-saver';

export async function getById(id: string, token: string): Promise<IApiResponse<IQuiz> | null> {
  try {
    if (!token) return null;

    const authAxios = await getAuthAxios(token);

    const res = await authAxios.get<IApiResponse<IQuiz>>(`${QUIZ}/${id}`);

    return res.data;
  } catch (e) {
    handleApiError(e);
    return null;
  }
}

export async function getAll(
  token: string,
  params: {
    pageNumber?: number;
    pageSize?: number;
    sortColumn?: string;
    sortDirection?: string;
    lastQuizId?: string;
    dateIn?: string;
    dateOut?: string;
    dateTimeColumn?: string;
    applicationUserId?: string | null;
    statusId?: string;
  } = {},
): Promise<IApiResponse<IPaginationResponse<IQuiz>> | null> {
  try {
    if (!token) return null;

    const authAxios = await getAuthAxios(token);
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const res = await authAxios.get<IApiResponse<IPaginationResponse<IQuiz>>>(
      `${QUIZ_ALL}?${searchParams.toString()}`,
    );

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addAnswersToQuestions(
  payload: IAddAnswersToQuestionsDto,
  token: string,
): Promise<IApiResponse<IQuiz> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);

  const res = await authAxios.post<IApiResponse<IQuiz>>(QUIZ_ADD_ANSWERS_TO_QUESTIONS, payload);

  return res.data;
}

export async function updateFirstStage(
  payload: IUpdateFirstStageDto,
  token: string,
): Promise<IApiResponse<IQuiz> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);

  const res = await authAxios.put<IApiResponse<IQuiz>>(QUIZ_UPDATE_FIRST_STAGE, payload);

  return res.data;
}

export async function update(
  payload: IUpdateQuizDto,
  token: string,
): Promise<IApiResponse<IQuiz> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);

  const res = await authAxios.put<IApiResponse<IQuiz>>(QUIZ_UPDATE, payload);

  return res.data;
}

export async function getAllQuizStatues(
  token: string,
): Promise<IApiResponse<IQuizStatus[]> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);

  const res = await authAxios.get<IApiResponse<IQuizStatus[]>>(QUIZ_GET_ALL_STATUES);

  return res.data;
}

export async function getAnswersToQuestions(
  quizId: string,
  token: string,
): Promise<IApiResponse<IAnswerOnQuestion[]> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);

  const res = await authAxios.get<IApiResponse<IAnswerOnQuestion[]>>(
    `${QUIZ_GET_ANSWERS_TO_QUESTIONS}/${quizId}`,
  );

  return res.data;
}

export async function quizDelete(
  quizId: string,
  token: string,
): Promise<IApiResponse<boolean> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);

  const res = await authAxios.delete<IApiResponse<boolean>>(`${QUIZ_DELETE}/${quizId}`);

  return res.data;
}

export async function quizDownload(quizId: string, token: string): Promise<void> {
  if (!token) return;

  const authAxios = await getAuthAxios(token);

  try {
    const res = await authAxios.get(`${QUIZ_DOWNLOAD}/${quizId}`, {
      responseType: 'blob',
    });

    const disposition = res.headers['content-disposition'];

    let filename = 'Анкета.pdf';

    if (disposition && disposition.includes('filename*=')) {
      const match = disposition.match(/filename\*=UTF-8''(.+)/);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1]);
      }
    }

    saveAs(res.data, filename);
  } catch (error) {
    console.error('Ошибка при скачивании анкеты:', error);
  }
}

export async function quizCrmProcessing(
  quizId: string,
  token: string,
): Promise<IApiResponse<number> | null> {
  if (!token) return null;

  const authAxios = await getAuthAxios(token);

  const res = await authAxios.get<IApiResponse<number>>(`${QUIZ_CRM_PROCESSING}/${quizId}`);

  return res.data;
}