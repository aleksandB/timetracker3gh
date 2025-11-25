// src/components/features/DirectoryManagement/hooks/useDirectionManagement.ts
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../store";
import {
  addDirection,
  updateDirection,
  removeDirection,
} from "../../../../store/slices/projectSlice";
import { Direction } from "../../../../entities/project/types"; // ✅ Добавляем импорт Direction

interface UseDirectionManagementProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentDirection: Direction | null; // ✅ Используем Direction вместо any
  setCurrentDirection: (direction: Direction | null) => void; // ✅ Используем Direction вместо any
}

export const useDirectionManagement = ({
  isDialogOpen,
  setIsDialogOpen,
  currentDirection,
  setCurrentDirection,
}: UseDirectionManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const directions = useSelector(
    (state: RootState) => state.projects.directions
  );
  const projects = useSelector((state: RootState) => state.projects.projects);

  const handleSave = () => {
    if (!currentDirection) return;

    const directionToSave = {
      ...currentDirection,
    };

    if (directionToSave.id) {
      dispatch(updateDirection(directionToSave));
    } else {
      dispatch(
        addDirection({
          ...directionToSave,
          id: `dir-${Date.now()}`, // Генерация ID
        })
      );
    }

    setIsDialogOpen(false);
    setCurrentDirection(null);
  };

  const handleEdit = (direction: Direction) => {
    // ✅ Убрали TODO, используем правильный тип Direction
    setCurrentDirection(direction);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(removeDirection(id));
  };

  return {
    directions,
    projects,
    handleSave,
    handleEdit,
    handleDelete,
  };
};
