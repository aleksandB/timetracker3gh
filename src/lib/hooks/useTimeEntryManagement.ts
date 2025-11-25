//src/lib/hooks/useTimeEntryManagement.ts
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  addTimeEntry,
  updateTimeEntry,
  removeTimeEntry,
} from "../../store/slices/timeEntrySlice";
import { TimeEntry } from "../../entities/types";

interface UseTimeEntryManagementProps {
  currentUser: { id: string }; // Добавляем currentUser для автоматического добавления userId
}

/**
 * Хук для управления записями времени
 * 
 * ИЗМЕНЕНИЕ: Теперь автоматически добавляет userId к каждой entry
 * Это гарантирует, что все записи будут привязаны к текущему пользователю
 * 
 * В Vue это был бы composable с inject/provide для currentUser
 */
export const useTimeEntryManagement = ({
  currentUser,
}: UseTimeEntryManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ ИСПРАВЛЕНИЕ: Автоматически добавляем userId и id к entry
  // Раньше: entry мог не иметь userId и id
  // Теперь: всегда добавляем userId текущего пользователя и генерируем id если его нет
  const addEntry = useCallback(
    (entry: TimeEntry) => {
      const entryWithUserId: TimeEntry = {
        ...entry,
        id: entry.id || `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Генерируем id если его нет
        userId: currentUser.id, // Гарантируем что userId всегда установлен
      };
      dispatch(addTimeEntry(entryWithUserId));
    },
    [dispatch, currentUser.id]
  );

  // ✅ ИСПРАВЛЕНИЕ: Добавляем userId и id ко всем entries
  const addEntries = useCallback(
    (newEntries: TimeEntry[]) => {
      newEntries.forEach((entry, index) => {
        const entryWithUserId: TimeEntry = {
          ...entry,
          id: entry.id || `entry-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`, // Генерируем уникальный id
          userId: currentUser.id, // Гарантируем что userId всегда установлен
        };
        dispatch(addTimeEntry(entryWithUserId));
      });
    },
    [dispatch, currentUser.id]
  );

  // ✅ ИСПРАВЛЕНИЕ: При обновлении сохраняем userId и id
  // В CalendarGrid передается id напрямую
  const updateEntry = useCallback(
    (id: string, entry: TimeEntry) => {
      // ✅ Используем id напрямую
      const entryWithUserId: TimeEntry = {
        ...entry,
        userId: entry.userId || currentUser.id, // Сохраняем существующий или добавляем новый
        id: id, // Используем переданный id
      };
      dispatch(updateTimeEntry(entryWithUserId));
    },
    [dispatch, currentUser.id]
  );

  // Удаление записи
  const deleteEntry = useCallback(
    (id: string) => {
      dispatch(removeTimeEntry(id));
    },
    [dispatch]
  );

  return {
    addEntry,
    addEntries,
    updateEntry,
    deleteEntry,
  };
};
