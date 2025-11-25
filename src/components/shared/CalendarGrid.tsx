import { cn } from "../ui/utils";
import { TimeEntryDialog } from "./TimeEntryDialog";
import { Direction, TimeEntry, Project } from "../../entities/types"; // ✅ Исправляем путь и добавляем Project
import { useCalendarGridLogic } from "@/lib/hooks/useCalendarGridLogic";
import { CalendarDirectionRow } from "./CalendarDirectionRow";
import { CalendarTotalRow } from "./CalendarTotalRow";
import { ProjectRow } from "./ProjectRow";

interface CalendarGridProps {
  currentDate: Date;
  entries: TimeEntry[];
  directions: Direction[];
  onAddEntry: (entry: TimeEntry) => void;
  onAddEntries?: (entries: TimeEntry[]) => void;
  onUpdateEntry: (id: string, entry: TimeEntry) => void; // ✅ Изменено: используем id вместо index
  onDeleteEntry: (id: string) => void; // ✅ Изменено: используем id вместо index
  readOnly?: boolean;
  userId?: string; // ✅ Добавляем userId для фильтрации записей
}

export function CalendarGrid({
  currentDate,
  entries,
  directions,
  onAddEntry,
  onAddEntries,
  onUpdateEntry,
  onDeleteEntry,
  readOnly = false,
  userId, // ✅ Получаем userId из props
}: CalendarGridProps) {
  // ✅ Если userId не передан, пытаемся получить из entries (для обратной совместимости)
  const effectiveUserId = userId || entries[0]?.userId || "";
  
  const {
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
    projectsWithDirections,
  } = useCalendarGridLogic({
    currentDate,
    entries,
    directions,
    readOnly,
    onAddEntry,
    onAddEntries,
    onUpdateEntry,
    onDeleteEntry,
    userId: effectiveUserId, // ✅ Передаем userId в хук
  });

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const getEntriesForDate = (day: number) => {
    const date = formatDate(day);
    return entries.filter((entry) => entry.date === date);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="sticky left-0 z-20 bg-slate-50 border-r border-slate-200 px-4 py-3 text-left text-sm text-slate-700 min-w-[200px]">
                Направление / День
              </th>
              {days.map((day: number) => (
                <th
                  key={day}
                  className={cn(
                    "border-r border-slate-200 px-3 py-2 text-center text-xs min-w-[80px]",
                    isWeekend(day) ? "bg-slate-100" : "",
                    isToday(day) ? "bg-blue-50" : ""
                  )}
                >
                  <div className="text-slate-900">{day}</div>
                  <div className="text-slate-500">
                    {
                      weekDays[
                        new Date(year, month, day).getDay() === 0
                          ? 6
                          : new Date(year, month, day).getDay() - 1
                      ]
                    }
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm text-slate-700 min-w-[100px]">
                Итого
              </th>
            </tr>
          </thead>
          <tbody>
            {projectsWithDirections.map(({ project, directions }: { project: Project; directions: Direction[] }) => (
              <>
                <ProjectRow
                  key={project.id}
                  project={project}
                  days={days}
                  year={year}
                  month={month}
                  isWeekend={isWeekend}
                  getDayBackgroundColor={getDayBackgroundColor}
                  getDirectionEntriesForDate={getDirectionEntriesForDate}
                  readOnly={readOnly}
                  directions={directions}
                  userId={effectiveUserId} // ✅ Передаем userId
                />
                {directions.map((direction: Direction) => (
                  <CalendarDirectionRow
                    key={direction.id}
                    direction={direction}
                    days={days}
                    year={year}
                    month={month}
                    isWeekend={isWeekend}
                    isToday={isToday}
                    getDayBackgroundColor={getDayBackgroundColor}
                    getDirectionEntriesForDate={getDirectionEntriesForDate}
                    handleCellClick={handleCellClick}
                    readOnly={readOnly}
                    userId={effectiveUserId} // ✅ Передаем userId
                  />
                ))}
              </>
            ))}

            <CalendarTotalRow
              days={days}
              year={year}
              month={month}
              isWeekend={isWeekend}
              getDayBackgroundColor={getDayBackgroundColor}
              getEntriesForDate={getEntriesForDate}
              entries={entries}
            />
          </tbody>
        </table>
      </div>

      <TimeEntryDialog
        open={!!selectedDate && !!selectedDirection}
        onOpenChange={(open) => !open && handleCloseDialog()}
        date={selectedDate || ""}
        direction={directions.find((d) => d.id === selectedDirection) || null}
        directions={directions}
        entries={selectedEntries}
        onAddEntry={onAddEntry}
        onAddEntries={onAddEntries}
        onUpdateEntry={onUpdateEntry}
        onDeleteEntry={onDeleteEntry}
      />
    </div>
  );
}
