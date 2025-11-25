// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserRole } from "../../entities/user/types";

interface UserState {
  list: User[];
  currentUserId: string | null;
}

// Начальный пользователь
const initialUser: User = {
  id: "admin-1",
  name: "Иван Петров",
  role: "admin",
  position: "Администратор",
};

const initialState: UserState = {
  list: [initialUser],
  currentUserId: initialUser.id,
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.list = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.list.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.list.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((u) => u.id !== action.payload);
      if (state.currentUserId === action.payload) {
        state.currentUserId = null;
      }
    },
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload;
    },
  },
});

export const { setUsers, addUser, updateUser, removeUser, setCurrentUser } =
  userSlice.actions;
export default userSlice;
