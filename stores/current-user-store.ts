import { IQuizVm } from './../mentorApi/model/viewModel/quizVm';
import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { getMe } from '@/mentorApi/request/getMe';
import { getCrmUser } from '@/mentorApi/request/getCrmUser';
import { getQuizById } from '@/mentorApi/request/getQuizById';

export type CurrentUserState = {
  id: string;
  elmaId?: string | null;
  userName: string;
  photoUrl?: string | null;
  quiz?: IQuizVm | null;
};

export type CounterActions = object & {};

export type CurrentUserStore = CurrentUserState & CounterActions;

export const defaultInitState: CurrentUserState = {
  id: '',
  elmaId: null,
  userName: '',
  photoUrl: null,
  quiz: null,
};

export const initCurrentUserState = async (): Promise<CurrentUserState> => {
  try {
    const meResponse = await getMe();
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
    };

    // CRM: фото пользователя
    if(me.elmaUserId){
      const crmResponse = await getCrmUser(me.elmaUserId);
      const photoFile = crmResponse?.Result?.userInfo?.photo?.file;
  
      if (photoFile) {
        state.photoUrl = `https://phone.eriskip.com/files/maximize/${photoFile}.jpg`;
      }
    }

    // Квиз
    if (me.quizId) {
      const quizResponse = await getQuizById(me.quizId);
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
      () => ({
        ...initState,
      }),
      { name: 'CurrentUserStore' },
    )
  );
};
