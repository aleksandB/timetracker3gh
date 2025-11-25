// src/pages/TeamTimePage.tsx

import { useOutletContext } from "react-router-dom";
import { TeamView } from "../components/features/TeamView";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export function TeamTimePage() {
  const { currentUser } = useOutletContext<{
    currentUser: import("../entities/user/types").User;
  }>();

  return (
    <div>
      <TeamView currentUser={currentUser} />
    </div>
  );
}
