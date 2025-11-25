// src/components/features/DirectoryManagement/hooks/useTypeManagement.ts
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../store";
import {
  addType,
  updateType,
  removeType,
} from "../../../../store/slices/projectSlice";
import { Type } from "../../../../entities/project/types";

interface UseTypeManagementProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentType: Type | null;
  setCurrentType: (type: Type | null) => void;
}

export const useTypeManagement = ({
  isDialogOpen,
  setIsDialogOpen,
  currentType,
  setCurrentType,
}: UseTypeManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const types = useSelector((state: RootState) => state.projects.types);

  const handleSave = () => {
    if (!currentType) return;

    // Проверяем, что parentId не ссылается на сам тип (цикл)
    if (currentType.parentId === currentType.id) {
      alert("Тип не может быть родителем самому себе");
      return;
    }

    const typeToSave: Type = {
      ...currentType,
      parentId: currentType.parentId,
    };

    if (typeToSave.id) {
      dispatch(updateType(typeToSave));
    } else {
      dispatch(
        addType({
          ...typeToSave,
          id: typeToSave.id, // ID задается пользователем
        })
      );
    }

    setIsDialogOpen(false);
    setCurrentType(null);
  };

  const handleEdit = (type: Type) => {
    setCurrentType(type);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    // Проверяем, есть ли дочерние типы
    const hasChildren = types.some(t => t.parentId === id);
    if (hasChildren) {
      alert("Нельзя удалить тип, у которого есть дочерние типы");
      return;
    }
    dispatch(removeType(id));
  };

  // Возвращаем всё, что нужно UI
  return {
    types,
    handleSave,
    handleEdit,
    handleDelete,
  };
};