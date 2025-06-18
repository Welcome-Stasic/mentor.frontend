import { IQuizVm } from './../mentorApi/model/viewModel/quizVm';
import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { API } from '@/lib/axios';

export type CurrentUserState = {
  id: string;
  elmaId?: string | null;
  userName: string;
  photoUrl?: string | null;
  quiz?: IQuizVm | null;
  roles: string[];
};

export type CurrentUserActions = {
  setQuiz: (quiz: IQuizVm | null) => void;
};

export type CurrentUserStore = CurrentUserState & CurrentUserActions;

export const defaultInitState: CurrentUserState = {
  id: '',
  elmaId: null,
  userName: '',
  photoUrl: null,
  quiz: null,
  roles: [],
};

export const initCurrentUserState = async (accessToken: string): Promise<CurrentUserState> => {
  try {
    const meResponse = await API.user.me(accessToken);

    const me = meResponse?.Result;

    if (!me) {
      return defaultInitState;
    }

    const state: CurrentUserState = {
      id: me.id,
      elmaId: me.elmaUserId ?? null,
      userName: me.userName,
      photoUrl: null,
      quiz: null,
      roles: [],
    };

    // CRM: фото пользователя
    if(me.elmaUserId){
      const crmResponse = await API.user.getCrmUserById(me.elmaUserId, accessToken);

      const photoFile = crmResponse?.Result?.userInfo?.photo?.file;
  
      if (photoFile) {
        state.photoUrl = `https://phone.eriskip.com/files/maximize/${photoFile}.jpg`;
      }
    }

    // Квиз
    if (me.quizId) {
      const quizResponse = await API.quiz.getById(me.quizId, accessToken);
      const quiz = quizResponse?.Result;

      if (quiz) {
        state.quiz = quiz;
      }
    }

    return state;
  } catch (error) {
    console.error('Error initializing current user state:', error);
    return defaultInitState;
  }
};

export const createCurrentUserStore = (initState: CurrentUserState = defaultInitState) => {
  return createStore<CurrentUserStore>()(
    devtools(
      (set) => ({
        ...initState,
        setQuiz: (quiz: IQuizVm | null) => {
          set((state) => ({ ...state.quiz, quiz }));
        },
      }),
      { name: 'CurrentUserStore' },
    )
  );
};
