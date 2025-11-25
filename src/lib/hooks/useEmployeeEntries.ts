//src/lib/hooks/useEmployeeEntries.ts
import { useState, useCallback } from "react";
import { TimeEntry } from "../../entities/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  addTimeEntry,
  updateTimeEntry,
  removeTimeEntry,
} from "../../store/slices/timeEntrySlice";
import {
  addProject as addProjectAction,
  addDirection,
} from "../../store/slices/projectSlice";
import { Project, Direction } from "../../entities/types";

interface UseEmployeeEntriesProps {
  teamEntries: TimeEntry[];
  formatDate: (day: number) => string;
}

export const useEmployeeEntries = ({
  teamEntries,
  formatDate,
}: UseEmployeeEntriesProps) => {
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [showAddProject, setShowAddProject] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const toggleUser = useCallback((userId: string) => {
    setExpandedUsers((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(userId)) {
        newExpanded.delete(userId);
      } else {
        newExpanded.add(userId);
      }
      return newExpanded;
    });
  }, []);

  const getUserEntries = useCallback(
    (userId: string) => {
      return teamEntries.filter((entry) => entry.userId === userId);
    },
    [teamEntries]
  );

  const getEmployeeEntries = useCallback(
    (userId: string) => {
      return teamEntries.filter((e) => e.userId === userId);
    },
    [teamEntries]
  );

  const getDirectionEntriesForDate = useCallback(
    (userId: string, directionId: string, day: number) => {
      const date = formatDate(day);
      return teamEntries.filter(
        (entry) =>
          entry.userId === userId &&
          entry.directionId === directionId &&
          entry.date === date
      );
    },
    [teamEntries, formatDate]
  );

  const addEmployeeEntry =
    (userId: string) => (entry: Omit<TimeEntry, "userId">) => {
      dispatch(addTimeEntry({ ...entry, userId }));
    };

  const updateEmployeeEntry = useCallback(
    (userId: string) => (id: string, entry: Omit<TimeEntry, "userId">) => {
      // ✅ Находим entry по id и обновляем
      const entryToUpdate = teamEntries.find((e) => e.id === id);
      if (entryToUpdate) {
        dispatch(
          updateTimeEntry({ ...entry, userId, id }) // ✅ Используем id напрямую
        );
      }
    },
    [teamEntries, dispatch]
  );

  const deleteEmployeeEntry = useCallback(
    (userId: string) => (id: string) => {
      // ✅ Удаляем по id напрямую
      dispatch(removeTimeEntry(id));
    },
    [dispatch]
  );

  const addProject = (project: Omit<Project, "directionIds" | "shortName">) => {
    const newProject: Project = {
      ...project,
      directionIds: [],
      shortName: project.name.substring(0, 3).toUpperCase(),
    };
    dispatch(addProjectAction(newProject));
  };

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
    expandedUsers,
    toggleUser,
    showAddProject,
    setShowAddProject,
    getUserEntries,
    getEmployeeEntries,
    getDirectionEntriesForDate,
    addEmployeeEntry,
    updateEmployeeEntry,
    deleteEmployeeEntry,
    addProject,
    addDirectionToProject,
  };
};
