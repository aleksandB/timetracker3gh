// src/components/features/DirectoryManagement/hooks/useProjectManagement.ts
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../store";
import {
  addProject,
  updateProject,
  removeProject,
} from "../../../../store/slices/projectSlice";
import { Project } from "../../../../entities/project/types"; // ✅ Добавляем импорт Project

interface UseProjectManagementProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentProject: Project | null; // ✅ Используем Project вместо any
  setCurrentProject: (project: Project | null) => void; // ✅ Используем Project вместо any
}

export const useProjectManagement = ({
  isDialogOpen,
  setIsDialogOpen,
  currentProject,
  setCurrentProject,
}: UseProjectManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector((state: RootState) => state.projects.projects);
  const directions = useSelector(
    (state: RootState) => state.projects.directions
  );

  const [selectedDirectionIds, setSelectedDirectionIds] = useState<string[]>(
    []
  );

  // ❗️Синхронизируем состояние при открытии диалога редактирования
  useEffect(() => {
    if (isDialogOpen && currentProject) {
      setSelectedDirectionIds(currentProject.directionIds || []);
    } else if (isDialogOpen && !currentProject) {
      // При добавлении нового проекта, список направлений пуст
      setSelectedDirectionIds([]);
    }
  }, [isDialogOpen, currentProject]);

  const handleSave = () => {
    if (!currentProject) return;

    const projectToSave = {
      ...currentProject,
      directionIds: selectedDirectionIds,
    };

    if (projectToSave.id) {
      dispatch(updateProject(projectToSave));
    } else {
      dispatch(
        addProject({
          ...projectToSave,
          id: `proj-${Date.now()}`, // Генерация ID
        })
      );
    }

    setIsDialogOpen(false);
    setCurrentProject(null);
    // selectedDirectionIds сбрасывается автоматически при закрытии диалога через useEffect
  };

  const handleEdit = (project: Project) => {
    // ✅ Убрали TODO, используем правильный тип Project
    setCurrentProject(project);
    // useEffect выше синхронизирует selectedDirectionIds
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(removeProject(id));
  };

  // Возвращаем всё, что нужно UI
  return {
    projects,
    directions,
    selectedDirectionIds,
    setSelectedDirectionIds,
    handleSave,
    handleEdit,
    handleDelete,
  };
};
