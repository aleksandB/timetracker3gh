//src/components/features/TeamView/TeamDashboardView.tsx
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { LayoutDashboard } from "lucide-react";
import { TeamDashboard } from "../../shared/TeamDashboard";
import { MonthNavigation } from "../../shared/MonthNavigation";
import { Direction, TimeEntry } from "../../../entities/types";
import { TeamMember } from "./types"; // ✅ Добавляем импорт TeamMember

interface TeamDashboardViewProps {
  viewMode: "summary" | "detailed" | "dashboard";
  onViewChange: (mode: "summary" | "detailed" | "dashboard") => void;
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  entries: TimeEntry[];
  directions: Direction[];
  teamMembers: TeamMember[]; // ✅ Используем TeamMember[] вместо any[]
}

export function TeamDashboardView({
  viewMode,
  onViewChange,
  currentDate,
  onPrevious,
  onNext,
  onToday,
  entries,
  directions,
  teamMembers,
}: TeamDashboardViewProps) {
  return (
    <div className="bg-slate-50 min-h-screen">
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

          <MonthNavigation
            currentDate={currentDate}
            onPrevious={onPrevious}
            onNext={onNext}
            onToday={onToday}
          />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <TeamDashboard
          entries={entries}
          directions={directions}
          currentDate={currentDate}
          teamMembers={teamMembers}
        />
      </div>
    </div>
  );
}
