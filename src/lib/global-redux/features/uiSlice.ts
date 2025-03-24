"use client";

import { Role } from "@/app/home/role-user-management/create-update-roles/page";
import { UserManagement } from "@/app/home/role-user-management/create-update-users/page";
import { createSlice } from "@reduxjs/toolkit";

export interface UiStates {
  governanceModalState: boolean;
  subBreadCrum: string;
  mainBreadcrumb: string;
  addNewUserOnRoleMenuModal: {
    isVisible: boolean;
    data: UserManagement | null;
  };
  addNewRoleOnRoleMenuModal: {
    isVisible: boolean;
    data: Role | null;
  };
}

const initialState: UiStates = {
  governanceModalState: false,
  subBreadCrum: "",
  mainBreadcrumb: "Dashboard",
  addNewUserOnRoleMenuModal: {
    isVisible: false,
    data: null,
  },
  addNewRoleOnRoleMenuModal: {
    isVisible: false,
    data: null,
  },
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
    showNewUserAddForm: (state, action) => {
      state.addNewUserOnRoleMenuModal.isVisible = true;
      state.addNewUserOnRoleMenuModal.data = action.payload;
    },
    hideNewUserAddForm: (state) => {
      state.addNewUserOnRoleMenuModal.isVisible = false;
      state.addNewUserOnRoleMenuModal.data = null;
    },
    showNewRoleAddForm: (state, action) => {
      state.addNewRoleOnRoleMenuModal.isVisible = true;
      state.addNewRoleOnRoleMenuModal.data = action.payload;
    },
    hideNewRoleAddForm: (state) => {
      state.addNewRoleOnRoleMenuModal.isVisible = false;
      state.addNewRoleOnRoleMenuModal.data = null;
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
  hideNewRoleAddForm,
  showNewRoleAddForm,
} = UiSlice.actions;

export default UiSlice.reducer;
