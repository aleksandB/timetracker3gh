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
import { Project, Direction } from "../../entities/project/types";
import { ProjectTreeNode, buildProjectTree } from "../../lib/utils/projectUtils";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProject: (projectIds: string[]) => void;
  allProjects: Project[]; // Only new project structure now
  allDirections: Direction[];
  assignedProjectIds: Set<string>;
}

interface ProjectTreeItemProps {
  node: ProjectTreeNode;
  directionsByProject: Record<string, Direction[]>;
  assignedProjectIds: Set<string>;
  selectedNewProjectIds: Set<string>;
  toggleProject: (projectId: string) => void;
  level?: number;
}

const ProjectTreeItem: React.FC<ProjectTreeItemProps> = ({
  node,
  directionsByProject,
  assignedProjectIds,
  selectedNewProjectIds,
  toggleProject,
  level = 0,
}) => {
  const projectId = node.project.id;
  const projectName = node.project.name;
  const directions = directionsByProject[projectId] || [];
  const isAssigned = assignedProjectIds.has(projectId);
  const isChecked = isAssigned || selectedNewProjectIds.has(projectId);
  const isDisabled = isAssigned;

  return (
    <div className="space-y-1">
      <div 
        className={`flex items-center gap-2 p-2 rounded ${level > 0 ? 'ml-' + (level * 4) : ''}`}
        style={{ marginLeft: level > 0 ? `${level * 1.5}rem` : '0' }}
      >
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
        <div className={`ml-${(level + 1) * 4} mt-1 space-y-1 text-sm text-slate-600 pl-6`}>
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

      {node.children.length > 0 && (
        <div className="space-y-1">
          {node.children.map((childNode) => (
            <ProjectTreeItem
              key={childNode.project.id}
              node={childNode}
              directionsByProject={directionsByProject}
              assignedProjectIds={assignedProjectIds}
              selectedNewProjectIds={selectedNewProjectIds}
              toggleProject={toggleProject}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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

  // Build project tree
  const projectTree = buildProjectTree(allProjects);

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
          {projectTree.length === 0 ? (
            <p className="text-slate-500">Нет доступных проектов</p>
          ) : (
            projectTree.map((node) => (
              <ProjectTreeItem
                key={node.project.id}
                node={node}
                directionsByProject={directionsByProject}
                assignedProjectIds={assignedProjectIds}
                selectedNewProjectIds={selectedNewProjectIds}
                toggleProject={toggleProject}
              />
            ))
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
