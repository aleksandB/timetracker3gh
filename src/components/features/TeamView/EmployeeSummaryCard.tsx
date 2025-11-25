//src/components/features/TeamView/EmployeeSummaryCard.tsx
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { ChevronDown, ChevronRight as ChevronRightIcon } from "lucide-react";
import { EmployeeDetailsPanel } from "./EmployeeDetailsPanel";
import { TeamMember } from "./types";
import { Project, Direction, TimeEntry } from "../../../entities/types";
import { UserTotals, UserDirectionBreakdown } from "../../../lib/hooks/types"; // ✅ Добавляем импорт типов

interface EmployeeSummaryCardProps {
  member: TeamMember;
  totals: UserTotals; // ✅ Используем UserTotals вместо any
  directionBreakdown: UserDirectionBreakdown; // ✅ Используем UserDirectionBreakdown вместо any
  userEntries: TimeEntry[];
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
  directions: Direction[];
  currentDate: Date; // ✅ Заменяем year, month, days на currentDate
  // ✅ Удаляем ненужные пропсы: year, month, days, formatDate, getDirectionEntriesForDate, projectsWithDirectionsForUser
  currentUser: { id: string };
  // ✅ Опциональные функции для редактирования (если нужны)
  onAddEntry?: (entry: TimeEntry) => void;
  onUpdateEntry?: (index: number, entry: TimeEntry) => void;
  onDeleteEntry?: (index: number) => void;
}

export function EmployeeSummaryCard({
  member,
  totals,
  directionBreakdown,
  userEntries,
  isExpanded,
  onToggle,
  onSelect,
  directions,
  currentDate, // ✅ Используем currentDate
  currentUser,
  onAddEntry, // ✅ Опциональные функции для редактирования
  onUpdateEntry,
  onDeleteEntry,
}: EmployeeSummaryCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onToggle}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </Button>

          <Avatar className="w-10 h-10">
            <AvatarFallback>{member.initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="text-sm text-slate-900">
              {member.name}
              {member.id === currentUser.id && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Вы
                </Badge>
              )}
            </div>
            <div className="text-xs text-slate-500">{member.position}</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-slate-500">Регулярные</div>
            <div className="text-sm text-slate-900">
              {totals.regular.toFixed(1)}ч
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Сверхурочные</div>
            <div className="text-sm text-orange-600">
              {totals.overtime.toFixed(1)}ч
            </div>
          </div>
          <div className="text-right min-w-[100px]">
            <div className="text-xs text-slate-500">Отпуск/Б/О</div>
            <div className="text-sm text-slate-900">
              {totals.specialDays.vacation +
                totals.specialDays.sick +
                totals.specialDays.dayoff}{" "}
              дн.
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onSelect}>
            Редактировать
          </Button>
        </div>
      </div>

      {isExpanded && (
        <EmployeeDetailsPanel
          directionBreakdown={directionBreakdown}
          directions={directions}
          userEntries={userEntries}
          memberId={member.id}
          currentDate={currentDate} // ✅ Передаем currentDate вместо year, month, days
          onAddEntry={onAddEntry} // ✅ Передаем функции для редактирования (если есть)
          onUpdateEntry={onUpdateEntry}
          onDeleteEntry={onDeleteEntry}
        />
      )}
    </div>
  );
}
