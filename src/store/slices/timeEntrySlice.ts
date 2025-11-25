import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimeEntry } from "../../entities/types";

const initialState: TimeEntry[] = [];

export const timeEntrySlice = createSlice({
  name: "timeEntries",
  initialState,
  reducers: {
    setTimeEntries: (state, action: PayloadAction<TimeEntry[]>) => {
      return action.payload;
    },
    addTimeEntry: (state, action: PayloadAction<TimeEntry>) => {
      state.push(action.payload);
    },
    updateTimeEntry: (state, action: PayloadAction<TimeEntry>) => {
      const index = state.findIndex((entry) => entry.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    removeTimeEntry: (state, action: PayloadAction<string>) => {
      return state.filter((entry) => entry.id !== action.payload);
    },
  },
});

export const {
  setTimeEntries,
  addTimeEntry,
  updateTimeEntry,
  removeTimeEntry,
} = timeEntrySlice.actions;
export default timeEntrySlice;
