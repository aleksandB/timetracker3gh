//src/lib/hooks/useTimeTrackingCalculations.ts
import { useMemo } from "react";
import { TimeEntry, Direction } from "../../entities/types";

interface UseTimeTrackingCalculationsProps {
  entries: TimeEntry[];
  directions: Direction[];
}

export const useTimeTrackingCalculations = ({
  entries,
  directions,
}: UseTimeTrackingCalculationsProps) => {
  // Расчет статистики
  const { totalRegular, totalOvertime } = useMemo(() => {
    const workEntries = entries.filter((entry) => {
      const dir = directions.find((d) => d.id === entry.directionId);
      return dir && !dir.isSpecial;
    });

    const regular = workEntries.reduce((sum, entry) => sum + entry.regular, 0);
    const overtime = workEntries.reduce(
      (sum, entry) => sum + entry.overtime,
      0
    );

    return { totalRegular: regular, totalOvertime: overtime };
  }, [entries, directions]);

  return {
    totalRegular,
    totalOvertime,
  };
};
