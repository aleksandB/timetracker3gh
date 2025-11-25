import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import {  
  Clock,
  Briefcase,
  Palmtree,
  Heart,  
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { TimeEntry, Direction } from "../../entities/types";

interface DashboardProps {
  entries: TimeEntry[];
  directions: Direction[];
  currentDate: Date; // ✅ Добавляем currentDate
  userName: string;
}

export function Dashboard({
  entries,
  directions,
  currentDate,
  userName,
}: DashboardProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Filter entries for current month
  const monthEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date + "T00:00:00");
    return entryDate.getFullYear() === year && entryDate.getMonth() === month;
  });

  // Calculate statistics
  const stats = {
    workHours: 0,
    overtime: 0,
    vacationDays: 0,
    sickDays: 0,
    dayoffDays: 0,
    totalDays: 0,
  };

  const entriesByDate = new Map<string, TimeEntry[]>();
  monthEntries.forEach((entry) => {
    if (!entriesByDate.has(entry.date)) {
      entriesByDate.set(entry.date, []);
    }
    entriesByDate.get(entry.date)!.push(entry);
  });

  entriesByDate.forEach((dayEntries) => {
    const hasVacation = dayEntries.some(
      (e) => e.directionId === "dir-vacation"
    );
    const hasSick = dayEntries.some((e) => e.directionId === "dir-sick");
    const hasDayoff = dayEntries.some((e) => e.directionId === "dir-dayoff");

    if (hasVacation) {
      stats.vacationDays++;
      stats.totalDays++;
    } else if (hasSick) {
      stats.sickDays++;
      stats.totalDays++;
    } else if (hasDayoff) {
      stats.dayoffDays++;
      stats.totalDays++;
    } else {
      // Regular work day
      dayEntries.forEach((entry) => {
        stats.workHours += entry.regular;
        stats.overtime += entry.overtime;
      });
      stats.totalDays++;
    }
  });

  // Direction breakdown (only regular hours for directions that are not special)
  const directionStats = new Map<
    string,
    { regular: number; overtime: number }
  >();
  monthEntries.forEach((entry) => {
    const direction = directions.find((d) => d.id === entry.directionId);
    if (direction && !direction.isSpecial) {
      const current = directionStats.get(entry.directionId) || {
        regular: 0,
        overtime: 0,
      };
      directionStats.set(entry.directionId, {
        regular: current.regular + entry.regular,
        overtime: current.overtime + entry.overtime,
      });
    }
  });

  const topDirections = Array.from(directionStats.entries())
    .map(([directionId, stats]) => ({
      direction: directions.find((d) => d.id === directionId)!,
      regular: stats.regular,
      overtime: stats.overtime,
    }))
    .sort((a, b) => b.regular - a.regular)
    .slice(0, 3);

  const workingDaysInMonth = getWorkingDaysInMonth(year, month);
  const expectedHours = workingDaysInMonth * 8;
  const workProgress =
    expectedHours > 0 ? (stats.workHours / expectedHours) * 100 : 0;

  // Check norm compliance: expectedHours = workHours (regular only) + specialCategoryHours
  // Overtime is NOT part of the norm
  const specialDays = stats.vacationDays + stats.sickDays + stats.dayoffDays;
  const specialCategoryHours = specialDays * 8;
  const totalAccountedHours = stats.workHours + specialCategoryHours;
  const isNormMet = Math.abs(totalAccountedHours - expectedHours) < 0.5; // 0.5h tolerance
  const deficit = expectedHours - totalAccountedHours;

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg text-slate-900">Дашборд</h2>
          <p className="text-sm text-slate-500">
            {monthNames[month]} {year} • {userName}
          </p>
        </div>
      </div>

      {/* Norm Compliance Alert */}
      {!isNormMet && (
        <div
          className={`p-4 rounded-lg border ${
            deficit > 0
              ? "bg-orange-50 border-orange-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={`w-5 h-5 mt-0.5 ${
                deficit > 0 ? "text-orange-600" : "text-blue-600"
              }`}
            />
            <div>
              <div
                className={`text-sm mb-1 ${
                  deficit > 0 ? "text-orange-900" : "text-blue-900"
                }`}
              >
                {deficit > 0
                  ? "Норма часов не выполнена"
                  : "Превышение нормы часов"}
              </div>
              <div
                className={`text-xs ${
                  deficit > 0 ? "text-orange-800" : "text-blue-800"
                }`}
              >
                Норма: {expectedHours}ч • Учтено:{" "}
                {totalAccountedHours.toFixed(1)}ч (работа:{" "}
                {stats.workHours.toFixed(1)}ч + ОТ/Б/О: {specialCategoryHours}ч)
                {stats.overtime > 0 &&
                  ` • Сверхурочные (не в норме): ${stats.overtime.toFixed(1)}ч`}
                {deficit > 0 &&
                  ` • Недостает: ${Math.abs(deficit).toFixed(1)}ч`}
                {deficit < 0 &&
                  ` • Превышение: ${Math.abs(deficit).toFixed(1)}ч`}
              </div>
            </div>
          </div>
        </div>
      )}

      {isNormMet && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <div className="text-sm text-green-900 mb-1">
                Норма часов выполнена
              </div>
              <div className="text-xs text-green-800">
                {totalAccountedHours.toFixed(1)}ч из {expectedHours}ч
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <Briefcase className="w-4 h-4" />
                <span>Рабочие часы</span>
              </div>
              <div className="text-2xl text-slate-900 mb-1">
                {stats.workHours.toFixed(1)}ч
              </div>
              <div className="text-xs text-slate-500">
                из {expectedHours}ч ({workingDaysInMonth} дн.)
              </div>
              <Progress value={workProgress} className="mt-2 h-1" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <Clock className="w-4 h-4" />
                <span>Сверхурочные</span>
              </div>
              <div className="text-2xl text-orange-600 mb-1">
                {stats.overtime.toFixed(1)}ч
              </div>
              <div className="text-xs text-slate-500">
                {stats.overtime > 0
                  ? `+${((stats.overtime / stats.workHours) * 100).toFixed(1)}%`
                  : "Нет сверхурочных"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
                <Palmtree className="w-4 h-4" />
                <span>Отпуск</span>
              </div>
              <div className="text-2xl text-blue-900 mb-1">
                {stats.vacationDays} дн.
              </div>
              <div className="text-xs text-blue-700">
                {stats.vacationDays > 0
                  ? `${stats.vacationDays * 8}ч`
                  : "Не использовано"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <Heart className="w-4 h-4" />
                <span>Больничный / Отгул</span>
              </div>
              <div className="text-2xl text-slate-900 mb-1">
                {stats.sickDays + stats.dayoffDays} дн.
              </div>
              <div className="text-xs text-slate-500">
                Б: {stats.sickDays} • О: {stats.dayoffDays}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Direction Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm text-slate-700 mb-4">Топ-3 направления</h3>
          <div className="space-y-3">
            {topDirections.length > 0 ? (
              topDirections.map(({ direction, regular, overtime }) => (
                <div key={direction.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: direction.color }}
                      />
                      <span className="text-sm text-slate-900">
                        {direction.name}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-900">
                        {regular.toFixed(1)}ч
                      </span>
                      {overtime > 0 && (
                        <span className="text-orange-600 ml-1">
                          +{overtime.toFixed(1)}ч
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress
                    value={(regular / stats.workHours) * 100}
                    className="h-1.5"
                    style={{
                      backgroundColor: `${direction.color}20`,
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500 text-center py-4">
                Нет данных по направлениям
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm text-slate-700 mb-4">Сводка за месяц</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">
                Всего дней с записями
              </span>
              <span className="text-sm text-slate-900">{stats.totalDays}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Регулярные часы</span>
              <span className="text-sm text-slate-900">
                {stats.workHours.toFixed(1)}ч
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Сверхурочные часы</span>
              <span className="text-sm text-orange-600">
                {stats.overtime.toFixed(1)}ч
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">
                Средняя загрузка/день
              </span>
              <span className="text-sm text-slate-900">
                {stats.totalDays > 0
                  ? (stats.workHours / stats.totalDays).toFixed(1)
                  : "0.0"}
                ч
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-600">Нерабочие дни</span>
              <span className="text-sm text-slate-900">
                {stats.vacationDays + stats.sickDays + stats.dayoffDays}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function getWorkingDaysInMonth(year: number, month: number): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let workingDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }

  return workingDays;
}
