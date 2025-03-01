"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface UiStates {
  governanceModalState: boolean;
}

const initialState: UiStates = {
  governanceModalState: false,
};

export const UiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showGovernanveModal: (state) => {
      state.governanceModalState = true;
    },
    hideGovernanceModal: (state) => {
      state.governanceModalState = false;
    },
  },
});

export const { hideGovernanceModal, showGovernanveModal } = UiSlice.actions;

export default UiSlice.reducer;
