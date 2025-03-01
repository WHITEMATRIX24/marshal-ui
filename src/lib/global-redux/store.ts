"use client";

import { configureStore } from "@reduxjs/toolkit";
import UiReducer from "./features/uiSlice";

export const store = configureStore({
  reducer: {
    ui: UiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
