//src/components/features/TeamView/EmployeeDetailedView.tsx
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { CalendarGrid } from "../../shared/CalendarGrid";
import { AddProjectDialog } from "../../shared/AddProjectDialog";
import { MonthNavigation } from "../../shared/MonthNavigation";
import { Download, Plus } from "lucide-react";
import { Direction, TimeEntry, Project } from "../../../entities/types";

interface EmployeeDetailedViewProps {
  viewMode: "summary" | "detailed" | "dashboard";
  onViewChange: (mode: "summary" | "detailed" | "dashboard") => void;
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  employee:
    | { id: string; name: string; position: string; initials: string }
    | undefined;
  employeeEntries: TimeEntry[];
  directions: Direction[];
  totals: { regular: number; overtime: number };
  showAddProject: boolean;
  setShowAddProject: (open: boolean) => void;
  addProject: (project: Omit<Project, "directionIds" | "shortName">) => void; // ✅ Используем Project вместо any
  addEmployeeEntry: (
    userId: string
  ) => (entry: Omit<TimeEntry, "userId">) => void;
  updateEmployeeEntry: (
    userId: string
  ) => (id: string, entry: Omit<TimeEntry, "userId">) => void; // ✅ Изменено: используем id вместо index
  deleteEmployeeEntry: (userId: string) => (id: string) => void; // ✅ Изменено: используем id вместо index
  selectedEmployee: string | null;
}

export function EmployeeDetailedView({
  viewMode,
  onViewChange,
  currentDate,
  onPrevious,
  onNext,
  onToday,
  employee,
  employeeEntries,
  directions,
  totals,
  showAddProject,
  setShowAddProject,
  addProject,
  addEmployeeEntry,
  updateEmployeeEntry,
  deleteEmployeeEntry,
  selectedEmployee,
}: EmployeeDetailedViewProps) {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => onViewChange("summary")}>
              ← Вернуться к обзору команды
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddProject(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Проект
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback>{employee?.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-slate-900">{employee?.name}</h2>
              <div className="text-sm text-slate-500">{employee?.position}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <MonthNavigation
              currentDate={currentDate}
              onPrevious={onPrevious}
              onNext={onNext}
              onToday={onToday}
            />

            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-slate-500">Регулярные: </span>
                <span className="text-slate-900">
                  {totals.regular.toFixed(1)}ч
                </span>
              </div>
              <div className="text-sm">
                <span className="text-slate-500">Сверхурочные: </span>
                <span className="text-orange-600">
                  {totals.overtime.toFixed(1)}ч
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <CalendarGrid
          currentDate={currentDate}
          entries={employeeEntries}
          directions={directions}
          onAddEntry={addEmployeeEntry(selectedEmployee!)}
          onUpdateEntry={updateEmployeeEntry(selectedEmployee!)}
          onDeleteEntry={deleteEmployeeEntry(selectedEmployee!)}
          userId={selectedEmployee || undefined} // ✅ Передаем userId для правильной фильтрации
        />
      </div>

      <AddProjectDialog
        open={showAddProject}
        onOpenChange={setShowAddProject}
        onAddProject={addProject}
      />
    </div>
  );
}
