// src/components/shared/ProjectRow.tsx
import { cn } from "../ui/utils";
import { Project, Direction, TimeEntry } from "../../entities/types";

interface ProjectRowProps {
  project: Project;
  days: number[];
  year: number;
  month: number;
  isWeekend: (day: number) => boolean;
  isToday?: (day: number) => boolean;
  getDayBackgroundColor: (day: number) => string;
  getDirectionEntriesForDate: (
    userId: string,
    directionId: string,
    day: number
  ) => TimeEntry[];
  readOnly: boolean;
  directions: Direction[];
  userId: string;
}

export function ProjectRow({
  project,
  days,
  year,
  month,
  isWeekend,
  isToday = () => false,
  getDayBackgroundColor,
  getDirectionEntriesForDate,
  readOnly,
  directions,
  userId,
}: ProjectRowProps) {
  // Суммируем все часы по всем направлениям проекта
  const totalRegular = directions.reduce((sum, dir) => {
    const dirEntries = days.flatMap((day) =>
      getDirectionEntriesForDate(userId, dir.id, day)
    );
    return sum + dirEntries.reduce((s, e) => s + e.regular, 0);
  }, 0);

  const totalOvertime = directions.reduce((sum, dir) => {
    const dirEntries = days.flatMap((day) =>
      getDirectionEntriesForDate(userId, dir.id, day)
    );
    return sum + dirEntries.reduce((s, e) => s + e.overtime, 0);
  }, 0);

  return (
    <tr className="border-t border-slate-200 bg-slate-50">
      <td className="sticky left-0 z-10 bg-slate-50 border-r border-slate-200 px-4 py-3 font-bold">
        {project.name}
      </td>
      {days.map((day) => {
        const dayTotal = directions.reduce((sum, dir) => {
          const dirEntries = getDirectionEntriesForDate(userId, dir.id, day);
          return (
            sum + dirEntries.reduce((dSum, entry) => dSum + entry.regular, 0)
          );
        }, 0);
        const dayOvertime = directions.reduce((sum, dir) => {
          const dirEntries = getDirectionEntriesForDate(userId, dir.id, day);
          return (
            sum + dirEntries.reduce((dSum, entry) => dSum + entry.overtime, 0)
          );
        }, 0);
        const hasEntries = dayTotal > 0 || dayOvertime > 0;

        return (
          <td
            key={day}
            className={cn(
              "border-r border-slate-200 px-2 py-2 text-center",
              getDayBackgroundColor(day)
            )}
          >
            {hasEntries ? (
              <div className="text-xs">
                <div className="text-slate-900">{dayTotal.toFixed(1)}</div>
                {dayOvertime > 0 && (
                  <div className="text-orange-600 text-[10px]">
                    +{dayOvertime.toFixed(1)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-300 text-xs">—</div>
            )}
          </td>
        );
      })}
      <td className="px-4 py-3 text-center">
        {totalRegular > 0 || totalOvertime > 0 ? (
          <div className="text-sm">
            <div className="text-slate-900">{totalRegular.toFixed(1)}ч</div>
            {totalOvertime > 0 && (
              <div className="text-orange-600 text-xs">
                +{totalOvertime.toFixed(1)}
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-300 text-sm">—</div>
        )}
      </td>
    </tr>
  );
}
