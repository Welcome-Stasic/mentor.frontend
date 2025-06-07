import { IQuizVm } from './../mentorApi/model/viewModel/quizVm';
import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { getMe } from '@/mentorApi/request/getMe';
import { getCrmUser } from '@/mentorApi/request/getCrmUser';
import { getQuizById } from '@/mentorApi/request/getQuizById';

export type CurrentUserState = {
  id: string;
  elmaId: string;
  userName: string;
  photoUrl: string;
  quiz: IQuizVm | null;
};

export type CounterActions = object & {};

export type CurrentUserStore = CurrentUserState & CounterActions;

export const defaultInitState: CurrentUserState = {
  id: '',
  elmaId: '',
  userName: '',
  photoUrl: '',
  quiz: null,
};

export const initCurrentUserState = async (): Promise<CurrentUserState> => {
  const response = await getMe();

  if (response !== null && response.Result) {
    const state = {
      id: response.Result.id,
      elmaId: response.Result.elmaUserId,
      userName: response.Result.userName,
    } as CurrentUserState;

    const crmResponse = await getCrmUser(state.elmaId);

    if (
      crmResponse !== null &&
      crmResponse.Result &&
      crmResponse.Result.userInfo &&
      crmResponse.Result.userInfo.photo
    ) {
      state.photoUrl = `https://phone.eriskip.com/files/maximize/${crmResponse.Result.userInfo.photo.file}.jpg`;
    }

    if(response.Result.quizId){
      const quizResponse = await getQuizById(response.Result.quizId);
  
      if (quizResponse !== null && quizResponse.Result) {
        state.quiz = quizResponse.Result;
      }
    }

    return state;
  }

  return defaultInitState;
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
