import { handleApiError } from "@/lib/utils/handleApiError";
import { QUIZ, QUIZ_ADD_ANSWERS_TO_QUESTIONS, QUIZ_ALL } from "../endpoint";
import { IApiResponse, IPaginationResponse } from "../types/base";
import { getAuthAxios } from "../authAxios";
import { IAddAnswersToQuestionsDto, IQuiz } from "../types/quiz";

export async function getById (id: string, token: string): Promise<IApiResponse<IQuiz> | null> {
  try {
    if(!token) return null;
        
    const authAxios = await getAuthAxios(token);
    
    const res = await authAxios.get<IApiResponse<IQuiz>>(`${QUIZ}/${id}`);

    return res.data;
  } catch (e) {
    handleApiError(e);
    return null;
  }
};


export async function getAll(token: string, applicationUserId: string | null = null): Promise<IApiResponse<IPaginationResponse<IQuiz>> | null> {
  try {
    if(!token) return null;
        
    const authAxios = await getAuthAxios(token);
    
    const searchParams = new URLSearchParams();

    if(applicationUserId){
      searchParams.append("applicationUserId", applicationUserId);
    }

    const res = await authAxios.get<IApiResponse<IPaginationResponse<IQuiz>>>(`${QUIZ_ALL}?${searchParams.toString()}`);

    return res.data;
    
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addAnswersToQuestions(payload: IAddAnswersToQuestionsDto, token: string): Promise<IApiResponse<boolean> | null> {
  try {
    if(!token) return null;
        
    const authAxios = await getAuthAxios(token);
    
    const res = await authAxios.post<IApiResponse<boolean>>(QUIZ_ADD_ANSWERS_TO_QUESTIONS, payload);

    return res.data;
    
  } catch (error) {
    console.error(error);
    return null;
  }
}