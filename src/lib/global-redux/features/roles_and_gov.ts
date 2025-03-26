"use client";
import { governance } from "@/models/governance";
import { roleModel } from "@/models/roles";
import { createSlice } from "@reduxjs/toolkit";

export interface StanderdsState {
  allGovernance: governance[] | null;
  allRoles: roleModel[] | null;
}

const initialState: StanderdsState = {
  allGovernance: null,
  allRoles: null,
};

export const RolesAndGovernance = createSlice({
  name: "rolesandgov",
  initialState,
  reducers: {
    insertGovernanceData: (state, action) => {
      state.allGovernance = action.payload;
    },
    insertRolesData: (state, action) => {
      state.allRoles = action.payload;
    },
  },
});

export const { insertGovernanceData, insertRolesData } =
  RolesAndGovernance.actions;

export default RolesAndGovernance.reducer;
