//src/lib/hooks/useTimeTrackingData.ts
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useDate } from "./useDate";
import { selectTimeEntriesByUserId } from "../../store/selectors/timeEntrySelectors";

interface UseTimeTrackingDataProps {
  initialDate?: Date;
  currentUser: { id: string }; // Добавляем currentUser для фильтрации
}

/**
 * Хук для получения данных для трекинга времени
 * 
 * В Vue это был бы composable, который возвращает reactive данные
 * В React это хук, который использует useSelector (аналог computed в Vue)
 * 
 * ИЗМЕНЕНИЕ: Теперь фильтрует entries по currentUser.id
 * Раньше брались ВСЕ записи, теперь только для текущего пользователя
 */
export const useTimeTrackingData = ({
  initialDate = new Date(2025, 10, 1),
  currentUser, // Обязательный параметр
}: UseTimeTrackingDataProps) => {
  const { currentDate, nextMonth, previousMonth, today } = useDate(initialDate);
  const [view, setView] = useState<"calendar" | "dashboard">("calendar");
  const [showAddProject, setShowAddProject] = useState(false);

  // ✅ ИСПРАВЛЕНИЕ: Используем селектор для фильтрации по userId
  // Раньше: const entries = useSelector((state: RootState) => state.timeEntries);
  // Теперь: фильтруем только записи текущего пользователя
  const entries = useSelector(selectTimeEntriesByUserId(currentUser.id));
  
  const projects = useSelector((state: RootState) => state.projects.projects);
  const directions = useSelector(
    (state: RootState) => state.projects.directions
  );

  return {
    // Дата и навигация
    currentDate,
    nextMonth,
    previousMonth,
    today,

    // Состояния представления
    view,
    setView,

    // Данные
    projects,
    directions,
    entries, // Теперь это только записи текущего пользователя

    // Управление проектами
    showAddProject,
    setShowAddProject,
  };
};
