//src/components/features/TeamView/TeamSummaryView.tsx
import { Button } from "../../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { Download, LayoutDashboard } from "lucide-react";
import { MonthNavigation } from "../../shared/MonthNavigation";
import { EmployeeSummaryCard } from "./EmployeeSummaryCard";
import { TeamMember } from "./types";
import { Project, Direction, TimeEntry } from "../../../entities/types";
import { UserTotals, UserDirectionBreakdown } from "../../../lib/hooks/types"; // ✅ Добавляем импорт типов

interface TeamSummaryViewProps {
  viewMode: "summary" | "detailed" | "dashboard";
  onViewChange: (mode: "summary" | "detailed" | "dashboard") => void;
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  allTeamMembers: TeamMember[];
  teamEntries: TimeEntry[];
  directions: Direction[];
  teamTotalRegular: number;
  teamTotalOvertime: number;
  expandedUsers: Set<string>;
  onToggleUser: (userId: string) => void;
  onEmployeeSelect: (userId: string) => void;
  getUserTotals: (userId: string) => UserTotals; // ✅ Используем UserTotals вместо any
  getUserDirectionBreakdown: (userId: string) => UserDirectionBreakdown; // ✅ Используем UserDirectionBreakdown вместо any
  getUserEntries: (userId: string) => TimeEntry[];
  getDirectionEntriesForDate: (
    userId: string,
    directionId: string,
    day: number
  ) => TimeEntry[];
  formatDate: (day: number) => string;
  currentUser: { id: string };
  projectsWithDirectionsForUser: {
    project: Project;
    directions: Direction[];
  }[];
}

export function TeamSummaryView({
  viewMode,
  onViewChange,
  currentDate,
  onPrevious,
  onNext,
  onToday,
  allTeamMembers,
  teamEntries,
  directions,
  teamTotalRegular,
  teamTotalOvertime,
  expandedUsers,
  onToggleUser,
  onEmployeeSelect,
  getUserTotals,
  getUserDirectionBreakdown,
  getUserEntries,
  getDirectionEntriesForDate,
  projectsWithDirectionsForUser,
  formatDate,
  currentUser,
}: TeamSummaryViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Tabs value={viewMode} onValueChange={onViewChange}>
              <TabsList>
                <TabsTrigger value="summary">Обзор</TabsTrigger>
                <TabsTrigger value="dashboard">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Дашборд
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center justify-between">
            <MonthNavigation
              currentDate={currentDate}
              onPrevious={onPrevious}
              onNext={onNext}
              onToday={onToday}
            />

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Всего сотрудников</div>
            <div className="text-2xl text-slate-900">
              {allTeamMembers.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Регулярные часы</div>
            <div className="text-2xl text-slate-900">
              {teamTotalRegular.toFixed(1)}ч
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Сверхурочные часы</div>
            <div className="text-2xl text-orange-600">
              {teamTotalOvertime.toFixed(1)}ч
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Отпуски / Б / О</div>
            <div className="text-2xl text-slate-900">
              {
                teamEntries.filter(
                  (e) =>
                    e.directionId === "dir-vacation" ||
                    e.directionId === "dir-sick" ||
                    e.directionId === "dir-dayoff"
                ).length
              }
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {allTeamMembers.map((member) => {
            const totals = getUserTotals(member.id);
            const isExpanded = expandedUsers.has(member.id);
            const directionBreakdown = getUserDirectionBreakdown(member.id);
            const userEntries = getUserEntries(member.id);

            return (
              <EmployeeSummaryCard
                key={member.id}
                member={member}
                totals={totals}
                directionBreakdown={directionBreakdown}
                userEntries={userEntries}
                isExpanded={isExpanded}
                onToggle={() => onToggleUser(member.id)}
                onSelect={() => onEmployeeSelect(member.id)}
                directions={directions}
                currentDate={currentDate} // ✅ Передаем currentDate вместо year, month, days
                currentUser={currentUser}
                // ✅ Функции для редактирования не передаем - таблица будет read-only
                // Если нужно редактирование, можно добавить позже
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
