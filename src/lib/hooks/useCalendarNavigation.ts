//src/lib/hooks/useCalendarNavigation.ts
import { useCallback } from "react";
import { useDate } from "./useDate";

interface UseCalendarNavigationProps {
  initialDate?: Date;
}

export const useCalendarNavigation = ({
  initialDate = new Date(2025, 9, 1),
}: UseCalendarNavigationProps = {}) => {
  const { currentDate, nextMonth, previousMonth, today } = useDate(initialDate);

  const formatDate = useCallback(
    (day: number) => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      return `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
    },
    [currentDate]
  );

  return {
    currentDate,
    nextMonth,
    previousMonth,
    today,
    formatDate,
  };
};
