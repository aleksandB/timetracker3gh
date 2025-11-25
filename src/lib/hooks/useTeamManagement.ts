//src/lib/hooks/useTeamManagement.ts
import { useMemo } from "react";
import { useTeamData } from "./useTeamData";
import { useUserTimeCalculations } from "./useUserTimeCalculations";
import { useViewMode } from "./useViewMode";
import { useCalendarNavigation } from "./useCalendarNavigation";
import { useEmployeeEntries } from "./useEmployeeEntries";
import { User } from "../../entities/user/types";
import { Project, Direction, TimeEntry } from "../../entities/types";

interface UseTeamManagementProps {
  currentUser: User;
  initialDate?: Date;
}

export const useTeamManagement = ({
  currentUser,
  initialDate = new Date(2025, 9, 1),
}: UseTeamManagementProps) => {
  // Состояния представления
  const { viewMode, setViewMode, selectedEmployee, setSelectedEmployee } =
    useViewMode();

  // Навигация по календарю
  const { currentDate, nextMonth, previousMonth, today, formatDate } =
    useCalendarNavigation({ initialDate });

  // Данные
  const { projects, directions, teamEntries, allTeamMembers } = useTeamData({
    currentUser,
  });

  // Работа с записями сотрудников
  const {
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
  } = useEmployeeEntries({ teamEntries, formatDate });

  // Статистика
  const {
    getUserTotals,
    getUserDirectionBreakdown,
    teamTotalRegular,
    teamTotalOvertime,
  } = useUserTimeCalculations({
    teamEntries,
    directions,
    getUserEntries,
  });

  // группировка направлений по проектам для конкретного пользователя
  const projectsWithDirectionsForUser = useMemo(() => {
    const userEntries = getUserEntries(selectedEmployee || currentUser.id);
    const userDirectionIds = new Set(userEntries.map((e) => e.directionId));
    const userDirections = directions.filter((d) => userDirectionIds.has(d.id));

    const projectMap = new Map<
      string,
      { project: Project; directions: Direction[] }
    >();
    userDirections.forEach((dir) => {
      if (!projectMap.has(dir.projectId)) {
        const project = projects.find((p) => p.id === dir.projectId);
        if (project) {
          projectMap.set(dir.projectId, {
            project,
            directions: [],
          });
        }
      }
      const projectEntry = projectMap.get(dir.projectId);
      if (projectEntry) {
        projectEntry.directions.push(dir);
      }
    });
    return Array.from(projectMap.values());
  }, [selectedEmployee, currentUser.id, getUserEntries, directions, projects]);

  const onEmployeeSelect = (id: string) => {
    setSelectedEmployee(id);
    setViewMode("detailed");
  };

  return {
    // Дата и навигация
    currentDate,
    nextMonth,
    previousMonth,
    today,
    formatDate,

    // Состояния представления
    viewMode,
    setViewMode,
    selectedEmployee,
    setSelectedEmployee,
    onEmployeeSelect,

    // Данные
    allTeamMembers,
    projects,
    directions,
    teamEntries,

    // Управление интерфейсом
    expandedUsers,
    toggleUser,
    showAddProject,
    setShowAddProject,

    // Управление проектами
    addProject,
    addDirectionToProject,

    // Статистика
    teamTotalRegular,
    teamTotalOvertime,
    getUserTotals,
    getUserDirectionBreakdown,

    // Работа с записями
    getUserEntries,
    getEmployeeEntries,
    addEmployeeEntry,
    updateEmployeeEntry,
    deleteEmployeeEntry,
    getDirectionEntriesForDate,
    projectsWithDirectionsForUser,
  };
};
