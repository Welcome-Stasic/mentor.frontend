import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'

export type CurrentUserState = {
  ElmaId: number
}

export type CounterActions = {
}

export type CurrentUserStore = CurrentUserState & CounterActions

export const initCurrentUserState = (): CurrentUserState => {
  return { ElmaId: 1 }
}

export const defaultInitState: CurrentUserState = {
  ElmaId: 0,
}

export const createCurrentUserStore = (
  initState: CurrentUserState = defaultInitState,
) => {
  return createStore<CurrentUserStore>()(devtools(() => ({
    ...initState
  })))
}
