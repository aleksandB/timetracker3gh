//src/lib/hooks/useCalendarGridLogic.ts
import { useState, useMemo } from "react";
import { Direction, TimeEntry, Project } from "../../entities/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface UseCalendarGridLogicProps {
  currentDate: Date;
  entries: TimeEntry[];
  directions: Direction[];
  readOnly?: boolean;
  onAddEntry: (entry: TimeEntry) => void;
  onAddEntries?: (entries: TimeEntry[]) => void;
  onUpdateEntry: (id: string, entry: TimeEntry) => void; // ✅ Изменено: используем id вместо index
  onDeleteEntry: (id: string) => void; // ✅ Изменено: используем id вместо index
  userId?: string; // ✅ Добавляем userId для фильтрации
}

export const useCalendarGridLogic = ({
  currentDate,
  entries,
  directions,
  readOnly = false,
  onAddEntry,
  onAddEntries,
  onUpdateEntry,
  onDeleteEntry,
  userId, // ✅ Получаем userId
}: UseCalendarGridLogicProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(
    null
  );
  const projects = useSelector((state: RootState) => state.projects.projects);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const getEntriesForDate = (day: number) => {
    const date = formatDate(day);
    return entries.filter((entry) => entry.date === date);
  };

  // ✅ ИСПРАВЛЕНИЕ: getDirectionEntriesForDate теперь принимает userId
  // Это нужно для правильной фильтрации записей в CalendarDirectionRow и ProjectRow
  // В Vue это было бы computed с параметрами
  const getDirectionEntriesForDate = (
    userId: string,
    directionId: string,
    day: number
  ) => {
    const date = formatDate(day);
    return entries.filter(
      (entry) =>
        entry.userId === userId &&
        entry.date === date &&
        entry.directionId === directionId
    );
  };

  const getDirectionTotal = (directionId: string) => {
    const directionEntries = entries.filter(
      (entry) => entry.directionId === directionId
    );
    const regular = directionEntries.reduce(
      (sum, entry) => sum + entry.regular,
      0
    );
    const overtime = directionEntries.reduce(
      (sum, entry) => sum + entry.overtime,
      0
    );
    return { regular, overtime };
  };

  const isWeekend = (day: number) => {
    const dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const getDayType = (
    day: number
  ): "normal" | "vacation" | "sick" | "dayoff" | null => {
    const dayEntries = getEntriesForDate(day);
    if (dayEntries.length === 0) return null;

    const hasVacation = dayEntries.some(
      (e) => e.directionId === "dir-vacation"
    );
    const hasSick = dayEntries.some((e) => e.directionId === "dir-sick");
    const hasDayoff = dayEntries.some((e) => e.directionId === "dir-dayoff");
    if (hasVacation) return "vacation";
    if (hasSick) return "sick";
    if (hasDayoff) return "dayoff";
    return "normal";
  };

  const getDayBackgroundColor = (day: number): string => {
    if (isWeekend(day)) return "bg-slate-50";

    const dayType = getDayType(day);
    switch (dayType) {
      case "vacation":
        return "bg-blue-50/50";
      case "sick":
        return "bg-red-50/50";
      case "dayoff":
        return "bg-yellow-50/50";
      case "normal":
        return "bg-white";
      default:
        return "bg-white";
    }
  };

  const handleCellClick = (day: number, directionId: string) => {
    if (!readOnly && !isWeekend(day)) {
      const dateStr = formatDate(day);
      setSelectedDate(dateStr);
      setSelectedDirection(directionId);
    }
  };

  const handleCloseDialog = () => {
    setSelectedDate(null);
    setSelectedDirection(null);
  };

  const selectedEntries = useMemo(() => {
    if (selectedDate && selectedDirection) {
      return entries
        .map((entry, index) => ({ entry, index }))
        .filter(
          ({ entry }) =>
            entry.date === selectedDate &&
            entry.directionId === selectedDirection
        );
    }
    return [];
  }, [selectedDate, selectedDirection, entries]);

  const projectsWithDirections = useMemo(() => {
    const projectMap = new Map<
      string,
      { project: Project; directions: Direction[] }
    >();
    directions.forEach((dir) => {
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
  }, [projects, directions]);

  return {
    days,
    year,
    month,
    isWeekend,
    isToday,
    getDayBackgroundColor,
    getDirectionEntriesForDate,
    getDirectionTotal,
    handleCellClick,
    handleCloseDialog,
    selectedDate,
    selectedDirection,
    selectedEntries,
    formatDate,
    // Передаём вниз
    readOnly,
    onAddEntry,
    onAddEntries,
    onUpdateEntry,
    onDeleteEntry,
    directions,
    entries,
    projectsWithDirections,
  };
};
