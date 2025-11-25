// src/components/features/TeamView/EmployeeDetailsPanel.tsx
import { useState } from "react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Edit2, Lock } from "lucide-react";
import { Direction, TimeEntry } from "../../../entities/types";
import { CalendarGrid } from "../../shared/CalendarGrid";

interface EmployeeDetailsPanelProps {
  directionBreakdown: Map<string, { regular: number; overtime: number }> | null;
  directions: Direction[];
  userEntries: TimeEntry[];
  memberId: string;
  currentDate: Date; // ✅ Добавляем currentDate для CalendarGrid
  // ✅ Удаляем ненужные пропсы: year, month, days, formatDate, getDirectionEntriesForDate, projectsWithDirectionsForUser
  // Они больше не нужны, т.к. CalendarGrid сам управляет этим
  onAddEntry?: (entry: TimeEntry) => void; // ✅ Опциональные функции для редактирования
  onUpdateEntry?: (id: string, entry: TimeEntry) => void; // ✅ Изменено: используем id вместо index
  onDeleteEntry?: (id: string) => void; // ✅ Изменено: используем id вместо index
  readOnly?: boolean; // ✅ По умолчанию read-only, но можно переключить
}

export function EmployeeDetailsPanel({
  directionBreakdown,
  directions,
  userEntries,
  memberId,
  currentDate,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  readOnly: initialReadOnly = true, // ✅ По умолчанию read-only
}: EmployeeDetailsPanelProps) {
  // ✅ Состояние для переключения между read-only и editable режимами
  // В Vue это было бы: const isReadOnly = ref(initialReadOnly)
  const [isReadOnly, setIsReadOnly] = useState(initialReadOnly);

  // ✅ Функции для редактирования (если не переданы, таблица остается read-only)
  const canEdit = !!(onAddEntry && onUpdateEntry && onDeleteEntry);

  return (
    <div className="border-t border-slate-200 bg-slate-50">
      {/* Direction Breakdown */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm text-slate-700">
            Распределение по направлениям
          </h4>
          {/* ✅ Кнопка для переключения режима редактирования */}
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReadOnly(!isReadOnly)}
              className="flex items-center gap-2"
            >
              {isReadOnly ? (
                <>
                  <Edit2 className="w-4 h-4" />
                  Редактировать
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Только просмотр
                </>
              )}
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {directionBreakdown
            ? Array.from(directionBreakdown.entries()).map(
                ([directionId, hours]) => {
                  const direction = directions.find(
                    (d) => d.id === directionId
                  );
                  if (!direction) return null;

                  const isSpecial = direction.isSpecial;
                  const daysSet = new Set(
                    userEntries
                      .filter((e) => e.directionId === directionId)
                      .map((e) => e.date)
                  ).size;

                  return (
                    <div
                      key={directionId}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: direction.color }}
                      />
                      <div>
                        <div className="text-xs text-slate-600">
                          {direction.name}
                        </div>
                        <div className="text-sm text-slate-900">
                          {isSpecial ? (
                            `${daysSet} дн.`
                          ) : (
                            <>
                              {hours.regular.toFixed(1)}ч
                              {hours.overtime > 0 && (
                                <span className="text-xs text-orange-600 ml-1">
                                  +{hours.overtime.toFixed(1)}ч
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            : null}
        </div>
      </div>

      {/* ✅ Заменяем кастомную таблицу на CalendarGrid */}
      <div className="p-4 bg-white">
        <CalendarGrid
          currentDate={currentDate}
          entries={userEntries}
          directions={directions}
          onAddEntry={onAddEntry || (() => {})} // ✅ Если функции не переданы, используем пустые
          onUpdateEntry={onUpdateEntry || (() => {})}
          onDeleteEntry={onDeleteEntry || (() => {})}
          readOnly={isReadOnly || !canEdit} // ✅ Режим read-only зависит от состояния и наличия функций
          userId={memberId}
        />
      </div>

      {/* Recent Entries */}
      <div className="p-4 bg-white border-t border-slate-200">
        <h4 className="text-sm text-slate-700 mb-3">Последние записи</h4>
        <div className="space-y-2">
          {userEntries?.slice(0, 5).map((entry, idx) => {
            const direction = directions.find(
              (d) => d.id === entry.directionId
            );
            const date = new Date(entry.date + "T00:00:00");

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-slate-50 rounded"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-2 h-2 rounded"
                    style={{ backgroundColor: direction?.color }}
                  />
                  <div className="flex-1">
                    <div className="text-xs text-slate-900">
                      {direction?.name}
                    </div>
                    {entry.description && (
                      <div className="text-xs text-slate-500">
                        {entry.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-500">
                    {date.toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                  {!direction?.isSpecial ? (
                    <>
                      <Badge variant="secondary" className="text-xs">
                        {entry.regular}ч
                      </Badge>
                      {entry.overtime > 0 && (
                        <Badge className="text-xs bg-orange-500">
                          +{entry.overtime}ч
                        </Badge>
                      )}
                    </>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {direction?.name.substring(0, 3).toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
            );
          }) || []}
        </div>
      </div>
    </div>
  );
}
