// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";
import { projectSlice } from "./slices/projectSlice";
import { timeEntrySlice } from "./slices/timeEntrySlice";
import { teamSlice } from "./slices/teamSlice";
import initSlice from "./slices/initSlice";

export const store = configureStore({
  reducer: {
    users: userSlice.reducer,
    projects: projectSlice.reducer,
    timeEntries: timeEntrySlice.reducer,
    teams: teamSlice.reducer,
    init: initSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
