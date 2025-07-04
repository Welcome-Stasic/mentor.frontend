'use client';

import { USER_ROLES } from '@/constants';
import {
  createCurrentUserStore,
  CurrentUserStore,
  defaultInitState,
  initCurrentUserState,
} from '@/stores/current-user-store';
import { useSession } from 'next-auth/react';
import { type ReactNode, createContext, useRef, useContext, useEffect } from 'react';
import { useStore } from 'zustand';

export type UserStoreApi = ReturnType<typeof createCurrentUserStore>;

export const CurrentUserStoreContext = createContext<UserStoreApi | undefined>(undefined);

export interface UserStoreProviderProps {
  children: ReactNode;
}

export const CurrentUserStoreProvider = ({ children }: UserStoreProviderProps) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const roles = session.data?.user.roles || [];
  const isAdmin = roles.includes(USER_ROLES.ADMIN.name);

  const storeRef = useRef<UserStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createCurrentUserStore(defaultInitState);
  }

  const load = async (accessToken: string) => {
    const initialState = await initCurrentUserState(accessToken, isAdmin);
    if (initialState) {
      storeRef.current?.setState(initialState);
    }
  };

  useEffect(() => {
    load(accessToken);
  }, [accessToken]);

  return (
    <CurrentUserStoreContext.Provider value={storeRef.current}>
      {children}
    </CurrentUserStoreContext.Provider>
  );
};

export const useCurrentUserStore = <T,>(selector: (store: CurrentUserStore) => T): T => {
  const currentUserStoreContext = useContext(CurrentUserStoreContext);

  if (!currentUserStoreContext) {
    throw new Error(`useCurrentUserStore must be used within CurrentUserStoreProvider`);
  }

  return useStore(currentUserStoreContext, selector);
};
