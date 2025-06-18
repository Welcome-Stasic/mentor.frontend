'use client';

import { createQuizzesStore, defaultInitState, initQuizzesState, QuizzesStore } from '@/stores/quizzes-store';
import { useSession } from 'next-auth/react';
import { type ReactNode, createContext, useRef, useContext, useEffect } from 'react';
import { useStore } from 'zustand';

export type QuizzesStoreApi = ReturnType<typeof createQuizzesStore>;

export const QuizzesStoreContext = createContext<QuizzesStoreApi | undefined>(undefined);

export interface QuizzesStoreProviderProps {
  children: ReactNode;
}

export const QuizzesStoreProvider = ({ children }: QuizzesStoreProviderProps) => {
  const session = useSession()
  const accessToken = session.data?.user.accessToken || '';
  
  const storeRef = useRef<QuizzesStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createQuizzesStore(defaultInitState);
  }

  const load = async (accessToken: string) => {
    const initialState = await initQuizzesState(accessToken);
    if (initialState) {
      storeRef.current?.setState(initialState);
    }
  };

  useEffect(() => {
    load(accessToken);
  }, [accessToken]);

  return (
    <QuizzesStoreContext.Provider value={storeRef.current}>
      {children}
    </QuizzesStoreContext.Provider>
  );
};

export const useQuizzesStore = <T,>(selector: (store: QuizzesStore) => T): T => {
  const quizzesStoreContext = useContext(QuizzesStoreContext);

  if (!quizzesStoreContext) {
    throw new Error(`useQuizzesStore must be used within QuizzesStoreProvider`);
  }

  return useStore(quizzesStoreContext, selector);
};
