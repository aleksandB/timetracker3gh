// src/components/shared/CalendarDirectionRow.tsx
import { cn } from "../ui/utils";
import { Direction, TimeEntry } from "../../../entities/types";

interface CalendarDirectionRowProps {
  direction: Direction;
  days: number[];
  year: number;
  month: number;
  userId: string;
  isWeekend: (day: number) => boolean;
  isToday: (day: number) => boolean;
  getDayBackgroundColor: (day: number) => string;
  getDirectionEntriesForDate: (
    userId: string,
    directionId: string,
    day: number
  ) => TimeEntry[];
  readOnly: boolean;
  handleCellClick?: (day: number, directionId: string) => void;
}

export function CalendarDirectionRow({
  direction,
  days,
  year,
  month,
  userId,
  isWeekend,
  isToday = () => false,
  getDayBackgroundColor,
  getDirectionEntriesForDate,
  readOnly,
  handleCellClick,
}: CalendarDirectionRowProps) {
  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50/50">
      <td className="sticky left-0 z-10 bg-white border-r border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: direction.color }}
          />
          <div>
            <div className="text-sm text-slate-900">{direction.name}</div>
            {direction.isSpecial && (
              <div className="text-xs text-slate-500">
                ({direction.name.substring(0, 3).toUpperCase()})
              </div>
            )}
          </div>
        </div>
      </td>
      {days.map((day) => {
        const directionEntries = getDirectionEntriesForDate(
          userId,
          direction.id,
          day
        );
        const regular = directionEntries.reduce(
          (sum, entry) => sum + entry.regular,
          0
        );
        const overtime = directionEntries.reduce(
          (sum, entry) => sum + entry.overtime,
          0
        );
        const hasEntries = regular > 0 || overtime > 0;

        return (
          <td
            key={day}
            onClick={
              readOnly || isWeekend(day)
                ? undefined
                : () => handleCellClick?.(day, direction.id)
            }
            className={cn(
              "border-r border-slate-200 px-2 py-2 text-center cursor-pointer transition-colors",
              getDayBackgroundColor(day),
              !readOnly && !isWeekend(day) && "hover:bg-slate-100",
              isWeekend(day) && "cursor-not-allowed opacity-50"
            )}
          >
            {hasEntries ? (
              <div className="text-xs">
                <div className="text-slate-900">{regular.toFixed(1)}</div>
                {overtime > 0 && (
                  <div className="text-orange-600 text-[10px]">
                    +{overtime.toFixed(1)}
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
        {(() => {
          const totals = days.reduce(
            (acc, day) => {
              const dayEntries = getDirectionEntriesForDate(
                userId,
                direction.id,
                day
              );
              acc.regular += dayEntries.reduce((sum, e) => sum + e.regular, 0);
              acc.overtime += dayEntries.reduce(
                (sum, e) => sum + e.overtime,
                0
              );
              return acc;
            },
            { regular: 0, overtime: 0 }
          );
          const hasTotal = totals.regular > 0 || totals.overtime > 0;
          return hasTotal ? (
            <div className="text-sm">
              <div className="text-slate-900">{totals.regular.toFixed(1)}ч</div>
              {totals.overtime > 0 && (
                <div className="text-orange-600 text-xs">
                  +{totals.overtime.toFixed(1)}
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-300 text-sm">—</div>
          );
        })()}
      </td>
    </tr>
  );
}
