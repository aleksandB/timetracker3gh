//src/lib/hooks/useViewMode.ts
import { useState } from "react";

export const useViewMode = () => {
  const [viewMode, setViewMode] = useState<
    "summary" | "detailed" | "dashboard"
  >("summary");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  return {
    viewMode,
    setViewMode,
    selectedEmployee,
    setSelectedEmployee,
  };
};
