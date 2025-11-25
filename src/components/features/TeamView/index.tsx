//src/components/features/TeamView/index.tsx
import { useTeamManagement } from "@/lib/hooks/useTeamManagement";
import { User } from "../../../entities/user/types";
import { TeamSummaryView } from "./TeamSummaryView";
import { TeamDashboardView } from "./TeamDashboardView";
import { TimeTracker } from "../TimeTracker";

interface TeamViewProps {
  currentUser: User;
}

export function TeamView({ currentUser }: TeamViewProps) {
  const {
    // Состояния
    viewMode,
    setViewMode,
    selectedEmployee,
    currentDate,
    allTeamMembers,    
    directions,
    teamEntries,
    expandedUsers,

    // Действия
    nextMonth,
    previousMonth,
    today,
    toggleUser,
    getDirectionEntriesForDate,
    onEmployeeSelect,

    // Статистика
    teamTotalRegular,
    teamTotalOvertime,
    getUserTotals,
    getUserDirectionBreakdown,
    getUserEntries,
    formatDate,
    projectsWithDirectionsForUser,
  } = useTeamManagement({ currentUser });

  // Функция возврата к обзору команды
  const handleBackToSummary = () => {
    setViewMode("summary");
  };

  //  Если в detailed view, показываем TimeTracker для выбранного сотрудника
  if (viewMode === "detailed" && selectedEmployee) {
    //  Найдём объект пользователя по ID
    const employee = allTeamMembers.find((m) => m.id === selectedEmployee);
    if (!employee) {
      // Если пользователь не найден, можно вернуть ошибку или пустой экран
      return <div>Сотрудник не найден</div>;
    }

    //  Рендерим TimeTracker, передавая выбранного сотрудника и функцию возврата
    return (
      <TimeTracker
        currentUser={employee}
        onBackToSummary={handleBackToSummary}
      />
    );
  }

  // Dashboard view
  if (viewMode === "dashboard") {
    return (
      <TeamDashboardView
        viewMode={viewMode}
        onViewChange={setViewMode}
        currentDate={currentDate}
        onPrevious={previousMonth}
        onNext={nextMonth}
        onToday={today}
        entries={teamEntries}
        directions={directions}
        teamMembers={allTeamMembers}
      />
    );
  }

  // Summary view
  return (
    <TeamSummaryView
      viewMode={viewMode}
      onViewChange={setViewMode}
      currentDate={currentDate}
      onPrevious={previousMonth}
      onNext={nextMonth}
      onToday={today}
      allTeamMembers={allTeamMembers}
      teamEntries={teamEntries}
      directions={directions}
      teamTotalRegular={teamTotalRegular}
      teamTotalOvertime={teamTotalOvertime}
      expandedUsers={expandedUsers}
      onToggleUser={toggleUser}      
      getUserTotals={getUserTotals}
      getUserDirectionBreakdown={getUserDirectionBreakdown}
      getUserEntries={getUserEntries}
      getDirectionEntriesForDate={getDirectionEntriesForDate}
      onEmployeeSelect={onEmployeeSelect}
      formatDate={formatDate}
      currentUser={currentUser}
      projectsWithDirectionsForUser={projectsWithDirectionsForUser}
    />
  );
}
