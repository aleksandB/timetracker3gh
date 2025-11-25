// src/components/shared/AddProjectDialog.tsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox"; // убедитесь, что у вас есть компонент Checkbox
import { Project, Direction, OldProject } from "../../entities/project/types";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProject: (projectIds: string[]) => void;
  allProjects: (Project | OldProject)[]; // Support both old and new project structures
  allDirections: Direction[];
  assignedProjectIds: Set<string>;
}

export function AddProjectDialog({
  open,
  onOpenChange,
  onAddProject,
  allProjects,
  allDirections,
  assignedProjectIds,
}: AddProjectDialogProps) {
  // Кэшируем directions по projectId
  const directionsByProject = allDirections.reduce((acc, dir) => {
    if (!acc[dir.projectId]) acc[dir.projectId] = [];
    acc[dir.projectId].push(dir);
    return acc;
  }, {} as Record<string, Direction[]>);

  // Состояние: выбранные НОВЫЕ проекты (не включая уже назначенные)
  const [selectedNewProjectIds, setSelectedNewProjectIds] = useState<
    Set<string>
  >(new Set());

  // Сброс выбора при открытии/закрытии
  useEffect(() => {
    if (open) {
      setSelectedNewProjectIds(new Set());
    }
  }, [open]);

  const toggleProject = (projectId: string) => {
    if (assignedProjectIds.has(projectId)) return; // нельзя менять уже назначенные

    setSelectedNewProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    const ids = Array.from(selectedNewProjectIds);
    if (ids.length === 0) {
      onOpenChange(false);
      return;
    }
    onAddProject(ids);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Выберите проекты</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {allProjects.length === 0 ? (
            <p className="text-slate-500">Нет доступных проектов</p>
          ) : (
            allProjects.map((project) => {
              // Handle both old and new project structures
              const projectId = project.id;
              const projectName = project.name;
              
              const directions = directionsByProject[projectId] || [];
              const isAssigned = assignedProjectIds.has(projectId);
              const isChecked =
                isAssigned || selectedNewProjectIds.has(projectId);
              const isDisabled = isAssigned;

              return (
                <div key={projectId} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      id={`proj-${projectId}`}
                      checked={isChecked}
                      onCheckedChange={() => toggleProject(projectId)}
                      disabled={isDisabled}
                    />
                    <label
                      htmlFor={`proj-${projectId}`}
                      className={`font-medium ${
                        isAssigned
                          ? "text-slate-500 line-through"
                          : "text-slate-900"
                      }`}
                    >
                      {projectName} {isAssigned && "(назначен)"}
                    </label>
                  </div>

                  {directions.length > 0 && (
                    <div className="ml-6 mt-2 space-y-1 text-sm text-slate-600">
                      {directions.map((dir) => (
                        <div key={dir.id} className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full inline-block"
                            style={{ backgroundColor: dir.color }}
                          ></span>
                          {dir.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>Добавить выбранные</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
