// src/components/features/DirectoryManagement/hooks/useTypeManagement.ts
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../store";
import {
  addType,
  updateType,
  removeType,
} from "../../../../store/slices/projectSlice";
import { Type } from "../../../../entities/types";

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

    // Проверяем, что ID не пустой и не равен 0 при создании
    if (!currentType.id || currentType.id <= 0) {
      alert("ID должен быть положительным числом");
      return;
    }

    // Проверяем, что parentId не ссылается на сам тип (цикл)
    if (currentType.parentId === currentType.id) {
      alert("Тип не может быть родителем самому себе");
      return;
    }

    const typeToSave: Type = {
      ...currentType,
      parentId: currentType.parentId,
    };

    // Проверяем, существует ли уже тип с таким ID
    // Если это обновление (редактирование), то не учитываем текущий тип при проверке дубликата
    // Если это создание нового, то проверяем, что ID не занят
    const isUpdate = !!currentType.id;
    if (isUpdate) {
      // При обновлении проверяем, что другой тип (не текущий) не использует такой ID
      if (types.some(t => t.id === currentType.id && t.id !== currentType.id)) {
        alert("Тип с таким ID уже существует");
        return;
      }
    } else {
      // При создании проверяем, что ID не равен 0 или отрицательному числу и не занят
      if (currentType.id <= 0) {
        alert("ID должен быть положительным числом");
        return;
      }
      if (types.some(t => t.id === currentType.id)) {
        alert("Тип с таким ID уже существует");
        return;
      }
    }

    if (currentType.id) {
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