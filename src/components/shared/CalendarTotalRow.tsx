//src/components/shared/CalendarTotalRow.tsx
import { cn } from "../ui/utils";
import { TimeEntry } from "../../../entities/types";

interface CalendarTotalRowProps {
  days: number[];
  year: number;
  month: number;
  isWeekend: (day: number) => boolean;
  getDayBackgroundColor: (day: number) => string;
  getEntriesForDate: (day: number) => TimeEntry[];
  entries: TimeEntry[];
}

export function CalendarTotalRow({
  days,
  year,
  month,
  isWeekend,
  getDayBackgroundColor,
  getEntriesForDate,
  entries,
}: CalendarTotalRowProps) {
  return (
    <tr className="border-t-2 border-slate-300 bg-slate-50">
      <td className="sticky left-0 z-10 bg-slate-50 border-r border-slate-200 px-4 py-3">
        <div className="text-sm text-slate-900">Всего</div>
      </td>
      {days.map((day) => {
        const dayEntries = getEntriesForDate(day);
        const regular = dayEntries.reduce(
          (sum, entry) => sum + entry.regular,
          0
        );
        const overtime = dayEntries.reduce(
          (sum, entry) => sum + entry.overtime,
          0
        );
        const hasEntries = regular > 0 || overtime > 0;

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
          const monthTotalRegular = entries.reduce(
            (sum, entry) => sum + entry.regular,
            0
          );
          const monthTotalOvertime = entries.reduce(
            (sum, entry) => sum + entry.overtime,
            0
          );
          const hasTotal = monthTotalRegular > 0 || monthTotalOvertime > 0;
          return hasTotal ? (
            <div className="text-sm">
              <div className="text-slate-900">
                {monthTotalRegular.toFixed(1)}ч
              </div>
              {monthTotalOvertime > 0 && (
                <div className="text-orange-600 text-xs">
                  +{monthTotalOvertime.toFixed(1)}
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
