// src/store/selectors/timeEntrySelectors.ts
// Селекторы для работы с записями времени (TimeEntry)

import { RootState } from "../index";
import { TimeEntry } from "../../entities/types";

/**
 * Получить все записи времени из store
 * В React/Redux селекторы - это функции, которые извлекают данные из store
 * (аналогично computed в Vue)
 */
export const selectAllTimeEntries = (state: RootState): TimeEntry[] => {
  return state.timeEntries;
};

/**
 * Получить записи времени для конкретного пользователя
 * Это основной селектор для фильтрации - он фильтрует массив entries по userId
 * 
 * В Vue это было бы computed: () => entries.filter(e => e.userId === userId)
 */
export const selectTimeEntriesByUserId = (userId: string) => {
  return (state: RootState): TimeEntry[] => {
    return state.timeEntries.filter((entry) => entry.userId === userId);
  };
};

/**
 * Получить записи времени для текущего пользователя
 * Использует currentUserId из userState
 */
export const selectCurrentUserTimeEntries = (state: RootState): TimeEntry[] => {
  const currentUserId = state.users.currentUserId;
  if (!currentUserId) return [];
  
  return state.timeEntries.filter((entry) => entry.userId === currentUserId);
};

/**
 * Получить записи времени за определенную дату для пользователя
 * Полезно для календаря
 */
export const selectTimeEntriesByDateAndUser = (userId: string, date: string) => {
  return (state: RootState): TimeEntry[] => {
    return state.timeEntries.filter(
      (entry) => entry.userId === userId && entry.date === date
    );
  };
};

/**
 * Получить записи времени для направления (direction) конкретного пользователя
 */
export const selectTimeEntriesByDirectionAndUser = (
  userId: string,
  directionId: string
) => {
  return (state: RootState): TimeEntry[] => {
    return state.timeEntries.filter(
      (entry) =>
        entry.userId === userId && entry.directionId === directionId
    );
  };
};



