"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface UiStates {
  governanceModalState: boolean;
  subBreadCrum: string;
}

const initialState: UiStates = {
  governanceModalState: false,
  subBreadCrum: "",
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
    setSubBredCrum: (state, action) => {
      state.subBreadCrum = action.payload;
    },
    removeSubBredCrum: (state) => {
      state.subBreadCrum = "";
    },
  },
});

export const {
  hideGovernanceModal,
  showGovernanveModal,
  removeSubBredCrum,
  setSubBredCrum,
} = UiSlice.actions;

export default UiSlice.reducer;
