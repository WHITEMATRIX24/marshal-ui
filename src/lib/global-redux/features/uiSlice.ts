"use client";

import { Role } from "@/app/home/role-user-management/create-or-update-roles/page";
import { AssignmentModel } from "@/models/assignment";
import { ComplianceAddModel } from "@/models/compilance";
import { TaskEditModel } from "@/models/taskdetail";
import { CreateUserModel } from "@/models/users";
import { createSlice } from "@reduxjs/toolkit";

export interface UiStates {
  governanceModalState: boolean;
  subBreadCrum: string;
  mainBreadcrumb: string;
  addNewUserOnRoleMenuModal: {
    isVisible: boolean;
    data: CreateUserModel | null;
  };
  addRoleOnRoleMenuModal: {
    isVisible: boolean;
    data: Role | null;
  };
  editRoleOnRoleMenuModal: {
    isVisible: boolean;
    data: Role | null;
  };
  changePasswordModal: {
    isVisible: boolean;
  };
  addEditComapilanecModal: {
    isVisible: boolean;
    data: ComplianceAddModel | null;
  };
  editTaskModal: {
    isVisible: boolean;
    data: TaskEditModel | null;
  };
  editAssignmentModal: {
    isVisible: boolean;
    data: AssignmentModel | null;
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
  editRoleOnRoleMenuModal: {
    isVisible: false,
    data: null,
  },
  addRoleOnRoleMenuModal: {
    isVisible: false,
    data: null,
  },
  changePasswordModal: {
    isVisible: false,
  },
  addEditComapilanecModal: {
    isVisible: false,
    data: null,
  },
  editTaskModal: {
    isVisible: false,
    data: null,
  },
  editAssignmentModal: {
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
      state.addRoleOnRoleMenuModal.isVisible = true;
      state.addRoleOnRoleMenuModal.data = action.payload;
    },
    hideNewRoleAddForm: (state) => {
      state.addRoleOnRoleMenuModal.isVisible = false;
      state.addRoleOnRoleMenuModal.data = null;
    },
    showEditRoleForm: (state, action) => {
      state.editRoleOnRoleMenuModal.isVisible = true;
      state.editRoleOnRoleMenuModal.data = action.payload;
    },
    hideEditRoleForm: (state) => {
      state.editRoleOnRoleMenuModal.isVisible = false;
      state.editRoleOnRoleMenuModal.data = null;
    },
    showChangePasswordForm: (state) => {
      state.changePasswordModal.isVisible = true;
    },
    hideChangePasswordForm: (state) => {
      state.changePasswordModal.isVisible = false;
    },
    showAddEditComapilanceModal: (state, action) => {
      state.addEditComapilanecModal.isVisible = true;
      state.addEditComapilanecModal.data = action.payload;
    },
    hideAddEditComapilanceModal: (state) => {
      state.addEditComapilanecModal.isVisible = false;
      state.addEditComapilanecModal.data = null;
    },
    showEditTaskModal: (state, action) => {
      state.editTaskModal.isVisible = true;
      state.editTaskModal.data = action.payload;
    },
    hideEditTaskModal: (state) => {
      state.editTaskModal.isVisible = false;
      state.editTaskModal.data = null;
    },
    showEditAssignmentModal: (state, action) => {
      state.editAssignmentModal.isVisible = true;
      state.editAssignmentModal.data = action.payload;
    },
    hideEditAssignmentModal: (state) => {
      state.editAssignmentModal.isVisible = false;
      state.editAssignmentModal.data = null;
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
  hideEditRoleForm,
  showEditRoleForm,
  hideChangePasswordForm,
  showChangePasswordForm,
  showAddEditComapilanceModal,
  hideAddEditComapilanceModal,
  showEditTaskModal,
  hideEditTaskModal,
  showEditAssignmentModal,
  hideEditAssignmentModal
} = UiSlice.actions;

export default UiSlice.reducer;
