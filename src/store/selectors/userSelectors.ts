import { RootState } from "../index";

export const selectCurrentUser = (state: RootState) => {
  const userState = state.users;
  if (!userState.currentUserId) return null;
  return userState.list.find((u) => u.id === userState.currentUserId) || null;
};

export const selectAllUsers = (state: RootState) => state.users.list;
