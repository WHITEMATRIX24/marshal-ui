"use client";

import { configureStore } from "@reduxjs/toolkit";
import UiReducer from "./features/uiSlice";
import StanderdsReducer from "./features/standerdsSlice";
import RolesAndGovernanceReducer from "./features/roles_and_gov";

export const store = configureStore({
  reducer: {
    ui: UiReducer,
    Standerds: StanderdsReducer,
    RolesAndGovernance: RolesAndGovernanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
