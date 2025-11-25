// src/components/shared/TeamDashboard.tsx

import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Users, Clock, Briefcase, Palmtree, AlertTriangle } from "lucide-react";
import { TimeEntry, Direction } from "../../entities/types";
import { Badge } from "../ui/badge";

interface TeamMember {
  id: string;
  name: string;
  position: string;
}

interface TeamDashboardProps {
  entries: TimeEntry[];
  directions: Direction[];
  currentDate: Date;
  teamMembers: TeamMember[];
}

export function TeamDashboard({
  entries,
  directions,
  currentDate,
  teamMembers,
}: TeamDashboardProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Filter entries for current month
  const monthEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date + "T00:00:00");
    return entryDate.getFullYear() === year && entryDate.getMonth() === month;
  });

  // Calculate team statistics
  const teamStats = {
    workHours: 0,
    overtime: 0,
    vacationDays: 0,
    sickDays: 0,
    dayoffDays: 0,
  };

  monthEntries.forEach((entry) => {
    const direction = directions.find((d) => d.id === entry.directionId);
    if (!direction) return;

    if (direction.isSpecial) {
      if (entry.directionId === "dir-vacation") teamStats.vacationDays++;
      else if (entry.directionId === "dir-sick") teamStats.sickDays++;
      else if (entry.directionId === "dir-dayoff") teamStats.dayoffDays++;
    } else {
      teamStats.workHours += entry.regular;
      teamStats.overtime += entry.overtime;
    }
  });

  const workingDaysInMonth = getWorkingDaysInMonth(year, month);
  const teamNormHours = workingDaysInMonth * 8 * teamMembers.length;

  // Direction breakdown (separate regular and overtime)
  const directionStats = new Map<
    string,
    { regular: number; overtime: number; members: Set<string> }
  >();
  monthEntries.forEach((entry) => {
    const direction = directions.find((d) => d.id === entry.directionId);
    if (direction && !direction.isSpecial) {
      const current = directionStats.get(entry.directionId) || {
        regular: 0,
        overtime: 0,
        members: new Set(),
      };
      current.regular += entry.regular;
      current.overtime += entry.overtime;
      if (entry.userId) current.members.add(entry.userId);
      directionStats.set(entry.directionId, current);
    }
  });

  const allDirections = Array.from(directionStats.entries())
    .map(([directionId, data]) => ({
      direction: directions.find((d) => d.id === directionId)!,
      regular: data.regular,
      overtime: data.overtime,
      memberCount: data.members.size,
    }))
    .filter((p) => p.direction)
    .sort((a, b) => b.regular - a.regular);

  // Member statistics
  const memberStats = teamMembers
    .map((member) => {
      const memberEntries = monthEntries.filter((e) => e.userId === member.id);

      const workEntries = memberEntries.filter((e) => {
        const dir = directions.find((d) => d.id === e.directionId);
        return dir && !dir.isSpecial;
      });

      const regular = workEntries.reduce((sum, e) => sum + e.regular, 0);
      const overtime = workEntries.reduce((sum, e) => sum + e.overtime, 0);

      // Count special days (unique dates)
      const vacationDays = new Set(
        memberEntries
          .filter((e) => e.directionId === "dir-vacation")
          .map((e) => e.date)
      ).size;
      const sickDays = new Set(
        memberEntries
          .filter((e) => e.directionId === "dir-sick")
          .map((e) => e.date)
      ).size;
      const dayoffDays = new Set(
        memberEntries
          .filter((e) => e.directionId === "dir-dayoff")
          .map((e) => e.date)
      ).size;

      const specialDays = vacationDays + sickDays + dayoffDays;
      const expectedHours = workingDaysInMonth * 8;
      const specialCategoryHours = specialDays * 8;
      // Norm check: regular hours + special category hours (overtime NOT included)
      const totalAccountedHours = regular + specialCategoryHours;

      const isNormMet = Math.abs(totalAccountedHours - expectedHours) < 0.5; // Allow 0.5h tolerance

      return {
        ...member,
        regular,
        overtime,
        vacationDays,
        sickDays,
        dayoffDays,
        specialDays,
        expectedHours,
        totalAccountedHours,
        isNormMet,
        deficit: expectedHours - totalAccountedHours,
      };
    })
    .sort((a, b) => b.regular - a.regular);

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

  const membersNotMeetingNorm = memberStats.filter((m) => !m.isNormMet);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg text-slate-900">Дашборд команды</h2>
          <p className="text-sm text-slate-500">
            {monthNames[month]} {year} • {teamMembers.length} сотрудников
          </p>
        </div>
      </div>

      {/* Alerts for norm violations */}
      {membersNotMeetingNorm.length > 0 && (
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <div className="text-sm text-orange-900 mb-2">
                {membersNotMeetingNorm.length} сотрудников не выполнили норму
                часов
              </div>
              <div className="space-y-1">
                {membersNotMeetingNorm.map((member) => (
                  <div key={member.id} className="text-xs text-orange-800">
                    <span className="font-medium">{member.name}:</span>{" "}
                    недостает {Math.abs(member.deficit).toFixed(1)}ч
                  </div>
                ))}
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
                <span>Рабочие часы команды</span>
              </div>
              <div className="text-2xl text-slate-900 mb-1">
                {teamStats.workHours.toFixed(1)}ч
              </div>
              <div className="text-xs text-slate-500">
                из {teamNormHours}ч ({workingDaysInMonth} дн.)
              </div>
              <Progress
                value={(teamStats.workHours / teamNormHours) * 100}
                className="mt-2 h-1"
              />
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
                {teamStats.overtime.toFixed(1)}ч
              </div>
              <div className="text-xs text-slate-500">
                {teamStats.overtime > 0
                  ? `+${(
                      (teamStats.overtime / teamStats.workHours) *
                      100
                    ).toFixed(1)}%`
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
                <span>Отпуска</span>
              </div>
              <div className="text-2xl text-blue-900 mb-1">
                {teamStats.vacationDays} дн.
              </div>
              <div className="text-xs text-blue-700">
                {teamStats.vacationDays > 0
                  ? `${teamStats.vacationDays * 8}ч`
                  : "Нет отпусков"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <Users className="w-4 h-4" />
                <span>Больничные / Отгулы</span>
              </div>
              <div className="text-2xl text-slate-900 mb-1">
                {teamStats.sickDays + teamStats.dayoffDays} дн.
              </div>
              <div className="text-xs text-slate-500">
                Б: {teamStats.sickDays} • О: {teamStats.dayoffDays}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Directions */}
        <Card className="p-4">
          <h3 className="text-sm text-slate-700 mb-4">Все направления</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {allDirections.length > 0 ? (
              allDirections.map(
                ({ direction, regular, overtime, memberCount }) => (
                  <div key={direction.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className="w-3 h-3 rounded flex-shrink-0"
                          style={{ backgroundColor: direction.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm text-slate-900">
                            {direction.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-slate-500">
                          {memberCount} чел.
                        </span>
                        <span className="text-sm text-slate-900">
                          {regular.toFixed(1)}ч
                        </span>
                        {overtime > 0 && (
                          <span className="text-sm text-orange-600">
                            +{overtime.toFixed(1)}ч
                          </span>
                        )}
                      </div>
                    </div>
                    <Progress
                      value={(regular / teamStats.workHours) * 100}
                      className="h-1.5"
                      style={{
                        backgroundColor: `${direction.color}20`,
                      }}
                    />
                  </div>
                )
              )
            ) : (
              <div className="text-sm text-slate-500 text-center py-4">
                Нет данных по направлениям
              </div>
            )}
          </div>
        </Card>

        {/* Team Members Performance */}
        <Card className="p-4">
          <h3 className="text-sm text-slate-700 mb-4">
            Статистика сотрудников
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {memberStats.map((member) => (
              <div
                key={member.id}
                className={`p-3 rounded-lg border ${
                  !member.isNormMet
                    ? "bg-orange-50 border-orange-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-900">
                        {member.name}
                      </span>
                      {!member.isNormMet && (
                        <AlertTriangle className="w-3 h-3 text-orange-600" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {member.position}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-900">
                      {member.regular.toFixed(1)}ч
                    </div>
                    {member.overtime > 0 && (
                      <div className="text-xs text-orange-600">
                        +{member.overtime.toFixed(1)}ч
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Работа: </span>
                    <span className="text-slate-900">
                      {member.regular.toFixed(1)}ч
                    </span>
                  </div>
                  {member.specialDays > 0 && (
                    <div>
                      <span className="text-slate-500">ОТ/Б/О: </span>
                      <span className="text-slate-900">
                        {member.specialDays} дн.
                      </span>
                    </div>
                  )}
                  <div className="ml-auto">
                    {member.isNormMet ? (
                      <Badge variant="secondary" className="text-xs">
                        Норма выполнена
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        -{Math.abs(member.deficit).toFixed(1)}ч
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  <Progress
                    value={
                      (member.totalAccountedHours / member.expectedHours) * 100
                    }
                    className="h-1"
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {member.totalAccountedHours.toFixed(1)} /{" "}
                    {member.expectedHours.toFixed(1)}ч
                  </div>
                </div>
              </div>
            ))}
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
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }

  return workingDays;
}
