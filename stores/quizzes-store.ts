import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { API } from '@/lib/axios';
import { IQuiz } from '@/lib/axios/types/quiz';

export type QuizzesState = {
  quizzes: IQuiz[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: string;
};

export type QuizzesActions = {
  setQuizzes: (quizzes: IQuiz[]) => void;
};

export type QuizzesStore = QuizzesState & QuizzesActions;

export const defaultInitState: QuizzesState = {
  quizzes: [],
  totalCount: 0,
  totalPages: 0,
  pageNumber: 1,
  pageSize: 10,
  sortColumn: '',
  sortDirection: '',
};

export const initQuizzesState = async (token: string): Promise<QuizzesState> => {
  try {
    const response = await API.quiz.getAll(token);

    const quizzes = response?.Result?.data || [];

    if (!response || !response.Result || !Array.isArray(quizzes)) {
      return defaultInitState;
    }

    const state: QuizzesState = {
      quizzes,
      totalCount: response.Result.totalCount,
      totalPages: response.Result.totalPages,
      pageNumber: response.Result.pageNumber,  
      pageSize: response.Result.pageSize,
      sortColumn: response.Result.sortColumn || '',
      sortDirection: response.Result.sortDirection || '',
    };

    return state;
  } catch (error) {
    console.error('Error initializing quizzes state:', error);
    return defaultInitState;
  }
};

export const createQuizzesStore = (initState: QuizzesState = defaultInitState) => {
  return createStore<QuizzesStore>()(
    devtools(
      () => ({
        ...initState,
      }),
      { name: 'QuizzesStore' },
    )
  );
};
