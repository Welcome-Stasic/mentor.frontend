'use client';

import {
  createCurrentUserStore,
  CurrentUserStore,
  defaultInitState,
  initCurrentUserState,
} from '@/stores/current-user-store';
import { type ReactNode, createContext, useRef, useContext, useEffect } from 'react';
import { useStore } from 'zustand';

export type UserStoreApi = ReturnType<typeof createCurrentUserStore>;

export const CurrentUserStoreContext = createContext<UserStoreApi | undefined>(undefined);

export interface UserStoreProviderProps {
  children: ReactNode;
}

export const CurrentUserStoreProvider = ({ children }: UserStoreProviderProps) => {
  const storeRef = useRef<UserStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createCurrentUserStore(defaultInitState);
  }

  const load = async () => {
    const initialState = await initCurrentUserState();
    if (initialState) {
      storeRef.current?.setState(initialState);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
