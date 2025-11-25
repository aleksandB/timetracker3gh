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
  projectIds: [], // Add empty projectIds array by default
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
      // Initialize projectIds if not present
      if (!action.payload.projectIds) {
        action.payload.projectIds = [];
      }
      state.list.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.list.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        // Ensure projectIds is maintained
        if (!action.payload.projectIds) {
          action.payload.projectIds = state.list[index].projectIds || [];
        }
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
    addUserProject: (state, action: PayloadAction<{ userId: string; projectId: string }>) => {
      const user = state.list.find(u => u.id === action.payload.userId);
      if (user) {
        if (!user.projectIds) {
          user.projectIds = [];
        }
        if (!user.projectIds.includes(action.payload.projectId)) {
          user.projectIds.push(action.payload.projectId);
        }
      }
    },
    removeUserProject: (state, action: PayloadAction<{ userId: string; projectId: string }>) => {
      const user = state.list.find(u => u.id === action.payload.userId);
      if (user && user.projectIds) {
        user.projectIds = user.projectIds.filter(id => id !== action.payload.projectId);
      }
    },
  },
});

export const { setUsers, addUser, updateUser, removeUser, setCurrentUser, addUserProject, removeUserProject } =
  userSlice.actions;
export default userSlice;
