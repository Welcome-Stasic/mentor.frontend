import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { API } from '@/lib/axios';
import { IQuiz } from '@/lib/axios/types/quiz';

export type CurrentUserState = {
  id: string;
  elmaId?: string | null;
  userName: string;
  photoUrl?: string | null;
  quiz?: IQuiz | null;
  isAdmin: boolean;
  isMentor: boolean;
  juniorIds: number[];
};

export type CurrentUserActions = {
  setQuiz: (quiz: IQuiz | null) => void;
};

export type CurrentUserStore = CurrentUserState & CurrentUserActions;

export const defaultInitState: CurrentUserState = {
  id: '',
  elmaId: null,
  userName: '',
  photoUrl: null,
  quiz: null,
  isAdmin: false,
  isMentor: false,
  juniorIds: [],
};

export const initCurrentUserState = async (
  accessToken: string,
  isAdmin: boolean,
): Promise<CurrentUserState> => {
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
      isAdmin,
      isMentor: false,
      juniorIds: [],
    };

    // CRM: фото пользователя
    if (me.elmaUserId) {
      const crmResponse = await API.user.getCrmUserById(me.elmaUserId, accessToken);

      const photoFile = crmResponse?.Result?.userInfo?.photo?.file;

      if (photoFile) {
        state.photoUrl = `https://phone.eriskip.com/files/maximize/${photoFile}.jpg`;
      }

      state.isMentor = crmResponse?.Result?.isMentor ?? false;
      state.juniorIds = crmResponse?.Result?.juniorIds ?? [];
    }

    if (!state.photoUrl) {
      const photoResponse = await API.user.getUserPhoto(me.id, accessToken);
      const photoUrl = photoResponse?.Result?.url || '';

      state.photoUrl = photoUrl;
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
        setQuiz: (quiz: IQuiz | null) => {
          set((state) => ({ ...state.quiz, quiz }));
        },
      }),
      { name: 'CurrentUserStore' },
    ),
  );
};
