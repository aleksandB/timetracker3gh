// src/components/features/TimeTracker/index.tsx
import {
  LayoutDashboard,
  Calendar,
  Plus,
  Download,
  Settings,
  CalendarRange,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../../ui/button";
import { CalendarGrid } from "../../shared/CalendarGrid";
import { Dashboard } from "../../shared/Dashboard";
import { AddProjectDialog } from "../../shared/AddProjectDialog";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { MonthNavigation } from "../../shared/MonthNavigation";
import { useTimeTracking } from "@/lib/hooks/useTimeTracking";
import { User } from "../../../entities/user/types";

interface TimeTrackerProps {
  currentUser: User;
  onBackToSummary?: () => void;
}

export function TimeTracker({
  currentUser,
  onBackToSummary,
}: TimeTrackerProps) {
  const {
    // Состояния
    view,
    setView,
    currentDate,
    projects,
    directions,
    entries,
    showAddProject,
    setShowAddProject,
    showDateRange,
    setShowDateRange,

    // Действия
    nextMonth,
    previousMonth,
    today,
    addEntry,
    addEntries,
    updateEntry,
    deleteEntry,
    addProject,

    // Статистика
    totalRegular,
    totalOvertime,
  } = useTimeTracking({
    initialDate: new Date(2025, 10, 1),
    currentUser,
  });

  const showBackButton = !!onBackToSummary;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {showBackButton ? (
              <Button variant="ghost" onClick={onBackToSummary}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться к обзору команды
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Tabs
                  value={view}
                  onValueChange={(v: string) =>
                    setView(v as "calendar" | "dashboard")
                  }
                >
                  <TabsList>
                    <TabsTrigger value="calendar">
                      <Calendar className="w-4 h-4 mr-2" />
                      Календарь
                    </TabsTrigger>
                    <TabsTrigger value="dashboard">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Дашборд
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddProject(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Проект
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              {!showBackButton && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDateRange(true)}
                  >
                    <CalendarRange className="w-4 h-4 mr-2" />
                    Диапазон дат
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </div>

          {view === "calendar" && (
            <>
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <MonthNavigation
                  currentDate={currentDate}
                  onPrevious={previousMonth}
                  onNext={nextMonth}
                  onToday={today}
                />

                {/* Summary */}
                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    <span className="text-slate-500">Регулярные: </span>
                    <span className="text-slate-900">
                      {totalRegular.toFixed(1)}ч
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">Сверхурочные: </span>
                    <span className="text-orange-600">
                      {totalOvertime.toFixed(1)}ч
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {view === "calendar" ? (
          <CalendarGrid
            currentDate={currentDate}
            entries={entries}
            directions={directions}
            onAddEntry={addEntry}
            onAddEntries={addEntries}
            onUpdateEntry={updateEntry} // ✅ Теперь CalendarGrid передает id напрямую
            onDeleteEntry={deleteEntry} // ✅ Теперь CalendarGrid передает id напрямую
            userId={currentUser.id} // ✅ Передаем userId для правильной фильтрации
          />
        ) : (
          <Dashboard
            entries={entries}
            directions={directions}
            currentDate={currentDate}
            userName={currentUser.name}
          />
        )}
      </div>

      <AddProjectDialog
        open={showAddProject}
        onOpenChange={setShowAddProject}
        onAddProject={(projectIds) => {
          projectIds.forEach((id) => addProject(id));
        }}
        allProjects={projects}
        allDirections={directions}
        assignedProjectIds={
          new Set(
            entries
              .filter((entry) => entry.userId === currentUser.id)
              .map((entry) => entry.projectId)
              .filter(Boolean) as string[]
          )
        }
      />
    </div>
  );
}
