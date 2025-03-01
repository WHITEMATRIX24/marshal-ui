"use client";
import { createSlice } from "@reduxjs/toolkit";
import { fromJSON } from "postcss";

export interface StanderdsState {
  selected_std_id: number;
}

const initialState: StanderdsState = {
  selected_std_id: 1,
};

export const StanderdSlice = createSlice({
  name: "standerdSlice",
  initialState,
  reducers: {
    changeSelectedStanderds: (state, action) => {
      state.selected_std_id = action.payload;
    },
  },
});

export const { changeSelectedStanderds } = StanderdSlice.actions;

export default StanderdSlice.reducer;
