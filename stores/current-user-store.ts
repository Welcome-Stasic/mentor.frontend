import { createStore } from 'zustand/vanilla';
import { devtools, persist } from 'zustand/middleware';
import { getMe } from '@/mentorApi/request/getMe';
import { getCrmUser } from '@/mentorApi/request/getCrmUser';

export type CurrentUserState = {
  id: string;
  elmaId: string;
  userName: string;
  photoUrl: string;
};

export type CounterActions = object & {};

export type CurrentUserStore = CurrentUserState & CounterActions;

export const defaultInitState: CurrentUserState = {
  id: '',
  elmaId: '',
  userName: '',
  photoUrl: '',
};

export const initCurrentUserState = async (): Promise<CurrentUserState> => {
  const response = await getMe();

  if (response != null && response.Result) {
    const state = {
      id: response.Result.id,
      elmaId: response.Result.elmaUserId,
      userName: response.Result.userName,
    } as CurrentUserState;

    const crmResponse = await getCrmUser(state.elmaId);

    if (
      crmResponse != null &&
      crmResponse.Result &&
      crmResponse.Result.userInfo &&
      crmResponse.Result.userInfo.photo
    ) {
      state.photoUrl = `https://phone.eriskip.com/files/maximize/${crmResponse.Result.userInfo.photo.file}.jpg`;
    }

    return state;
  }

  return defaultInitState;
};

export const createCurrentUserStore = (initState: CurrentUserState = defaultInitState) => {
  return createStore<CurrentUserStore>()(
    persist(
      devtools(
        () => ({
          ...initState,
        }),
        { name: 'CurrentUserStore' },
      ),
      {
        name: 'current-user-storage', // ключ в localStorage
      },
    ),
  );
};
