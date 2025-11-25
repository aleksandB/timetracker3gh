import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Пока просто пустой объект, позже будет структура команды
const initialState = {};

export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
  },
});

export const { setTeams } = teamSlice.actions;
export default teamSlice;
