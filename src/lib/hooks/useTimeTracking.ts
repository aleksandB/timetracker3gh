// src/lib/hooks/useTimeTracking.ts
import { useState } from "react";
import { useTimeTrackingData } from "./useTimeTrackingData";
import { useTimeEntryManagement } from "./useTimeEntryManagement";
import { useTimeTrackingCalculations } from "./useTimeTrackingCalculations";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  addProject as addProjectAction,
  addDirection,
} from "../../store/slices/projectSlice";
import { Project, Direction } from "../../entities/types";

interface UseTimeTrackingProps {
  initialDate?: Date;
  currentUser: { id: string; name: string };
}

export const useTimeTracking = ({
  initialDate = new Date(2025, 10, 1),
  currentUser,
}: UseTimeTrackingProps) => {
  // Данные
  // ✅ ИСПРАВЛЕНИЕ: Передаем currentUser в useTimeTrackingData для фильтрации
  const {
    currentDate,
    nextMonth,
    previousMonth,
    today,
    view,
    setView,
    projects,
    directions,
    entries, // Теперь это только записи текущего пользователя
    showAddProject,
    setShowAddProject,
  } = useTimeTrackingData({ initialDate, currentUser });

  // ✅ Добавим состояние для диапазона дат
  const [showDateRange, setShowDateRange] = useState(false);

  // Управление записями
  // ✅ ИСПРАВЛЕНИЕ: Передаем currentUser для автоматического добавления userId
  const { addEntry, addEntries, updateEntry, deleteEntry } =
    useTimeEntryManagement({ currentUser });

  // Статистика
  const { totalRegular, totalOvertime } = useTimeTrackingCalculations({
    entries,
    directions,
  });

  const dispatch = useDispatch<AppDispatch>();

  // Добавление проекта
  const addProject = (project: Omit<Project, "directionIds" | "shortName">) => {
    const newProject: Project = {
      ...project,
      directionIds: [],
      shortName: project.name.substring(0, 3).toUpperCase(),
    };
    dispatch(addProjectAction(newProject));
  };

  // Добавление направления
  const addDirectionToProject = (
    direction: Omit<Direction, "projectId">,
    projectId: string
  ) => {
    const newDirection: Direction = {
      ...direction,
      projectId,
    };
    dispatch(addDirection(newDirection));
  };

  return {
    // Дата и навигация
    currentDate,
    nextMonth,
    previousMonth,
    today,

    // Состояния представления
    view,
    setView,

    //  Состояния для диапазона дат
    showDateRange,
    setShowDateRange,

    // Данные
    projects,
    directions,
    entries,

    // Управление проектами
    showAddProject,
    setShowAddProject,
    addProject,

    // Управление записями
    addEntry,
    addEntries,
    updateEntry,
    deleteEntry,

    // Статистика
    totalRegular,
    totalOvertime,
  };
};
