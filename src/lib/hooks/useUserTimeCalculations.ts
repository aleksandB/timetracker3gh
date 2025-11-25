//src/lib/hooks/useUserTimeCalculations.ts
import { useMemo, useCallback } from "react";
import { Direction, TimeEntry } from "../../entities/types";

interface UseUserTimeCalculationsProps {
  teamEntries: TimeEntry[];
  directions: Direction[];
  getUserEntries: (userId: string) => TimeEntry[];
}

export const useUserTimeCalculations = ({
  teamEntries,
  directions,
  getUserEntries,
}: UseUserTimeCalculationsProps) => {
  const getUserTotals = useCallback(
    (userId: string) => {
      const entries = getUserEntries(userId);
      const workEntries = entries.filter((e) => {
        const dir = directions.find((d) => d.id === e.directionId);
        return dir && !dir.isSpecial;
      });

      const regular = workEntries.reduce(
        (sum, entry) => sum + entry.regular,
        0
      );
      const overtime = workEntries.reduce(
        (sum, entry) => sum + entry.overtime,
        0
      );

      const specialDays = {
        vacation: new Set(
          entries
            .filter((e) => {
              const dir = directions.find((d) => d.id === e.directionId);
              return dir && dir.id === "dir-vacation";
            })
            .map((e) => e.date)
        ).size,
        sick: new Set(
          entries
            .filter((e) => {
              const dir = directions.find((d) => d.id === e.directionId);
              return dir && dir.id === "dir-sick";
            })
            .map((e) => e.date)
        ).size,
        dayoff: new Set(
          entries
            .filter((e) => {
              const dir = directions.find((d) => d.id === e.directionId);
              return dir && dir.id === "dir-dayoff";
            })
            .map((e) => e.date)
        ).size,
      };

      return { regular, overtime, specialDays };
    },
    [getUserEntries, directions]
  );

  const getUserDirectionBreakdown = useCallback(
    (userId: string) => {
      const entries = getUserEntries(userId);
      const breakdown = new Map<
        string, // <-- directionId
        { regular: number; overtime: number }
      >();

      entries.forEach((entry) => {
        const current = breakdown.get(entry.directionId) || {
          regular: 0,
          overtime: 0,
        };
        breakdown.set(entry.directionId, {
          regular: current.regular + entry.regular,
          overtime: current.overtime + entry.overtime,
        });
      });

      return breakdown;
    },
    [getUserEntries]
  );

  const { teamTotalRegular, teamTotalOvertime } = useMemo(() => {
    const workEntries = teamEntries.filter((e) => {
      const dir = directions.find((d) => d.id === e.directionId);
      return dir && !dir.isSpecial;
    });

    const regular = workEntries.reduce((sum, entry) => sum + entry.regular, 0);
    const overtime = workEntries.reduce(
      (sum, entry) => sum + entry.overtime,
      0
    );

    return { teamTotalRegular: regular, teamTotalOvertime: overtime };
  }, [teamEntries, directions]);

  return {
    getUserTotals,
    getUserDirectionBreakdown,
    teamTotalRegular,
    teamTotalOvertime,
  };
};
