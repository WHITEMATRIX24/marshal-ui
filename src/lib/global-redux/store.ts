"use client";

import { configureStore } from "@reduxjs/toolkit";
import UiReducer from "./features/uiSlice";
import StanderdsReducer from "./features/standerdsSlice";

export const store = configureStore({
  reducer: {
    ui: UiReducer,
    Standerds: StanderdsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
