"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface UiStates {
  governanceModalState: boolean;
  subBreadCrum: string;
  mainBreadcrumb: string;
  addNewUserOnRoleMenuModal: boolean;
}

const initialState: UiStates = {
  governanceModalState: false,
  subBreadCrum: "",
  mainBreadcrumb: "Dashboard",
  addNewUserOnRoleMenuModal: false,
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
    setMainBreadcrumb: (state, action) => {
      state.mainBreadcrumb = action.payload;
    },
    showNewUserAddForm: (state) => {
      state.addNewUserOnRoleMenuModal = true;
    },
    hideNewUserAddForm: (state) => {
      state.addNewUserOnRoleMenuModal = false;
    },
  },
});

export const {
  hideGovernanceModal,
  showGovernanveModal,
  removeSubBredCrum,
  setSubBredCrum,
  setMainBreadcrumb,
  hideNewUserAddForm,
  showNewUserAddForm,
} = UiSlice.actions;

export default UiSlice.reducer;
