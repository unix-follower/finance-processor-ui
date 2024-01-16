import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"

import predictionsReducer from "@/components/predictions/predictionsSlice"

export function createStore() {
  return configureStore({
    reducer: {
      predictionState: predictionsReducer,
    },
  })
}

const store = createStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store
