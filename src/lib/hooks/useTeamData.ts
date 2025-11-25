//src/lib/hooks/useTeamData.ts
import { useMemo } from "react";
import { User } from "../../entities/user/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectAllUsers } from "../../store/selectors/userSelectors";

interface UseTeamDataProps {
  currentUser: User;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  initials: string;
}

export const useTeamData = ({ currentUser }: UseTeamDataProps) => {
  const allUsers = useSelector(selectAllUsers);
  const projects = useSelector((state: RootState) => state.projects.projects);
  const directions = useSelector(
    (state: RootState) => state.projects.directions
  );
  const teamEntries = useSelector((state: RootState) => state.timeEntries);

  const allTeamMembers = useMemo((): TeamMember[] => {
    const nonAdminUsers = allUsers.filter((u) => u.role !== "admin");

    const members = nonAdminUsers.map((u) => ({
      id: u.id,
      name: u.name,
      position: u.position,
      initials: u.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
    }));

    const currentLeadIndex = members.findIndex((m) => m.id === currentUser.id);
    if (currentLeadIndex === -1) {
      members.unshift({
        id: currentUser.id,
        name: currentUser.name,
        position: currentUser.position || "Тимлид",
        initials: currentUser.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase(),
      });
    }

    // Ensure that all team members have a defined string for 'position'
    const membersWithDefaultPosition = members.map((m) => ({
      ...m,
      position: m.position ?? "",
    }));

    return membersWithDefaultPosition;
  }, [allUsers, currentUser]);

  return {
    projects,
    directions,
    teamEntries,
    allTeamMembers,
  };
};
