// src/components/features/DirectoryManagement/hooks/useEmployeeManagement.ts
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../store";
import {
  addUser,
  updateUser,
  removeUser,
} from "../../../../store/slices/userSlice";
import { User } from "../../../../entities/user/types"; // ✅ Добавляем импорт User

interface UseEmployeeManagementProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentEmployee: User | null; // ✅ Используем User вместо any
  setCurrentEmployee: (user: User | null) => void; // ✅ Используем User вместо any
}

export const useEmployeeManagement = ({
  isDialogOpen,
  setIsDialogOpen,
  currentEmployee,
  setCurrentEmployee,
}: UseEmployeeManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();
  // ❗️ВАЖНО: Получаем ВСЕ записи из store, а не только "teamEntries"
  const allTimeEntries = useSelector((state: RootState) => state.timeEntries);
  const directions = useSelector(
    (state: RootState) => state.projects.directions
  );
  const users = useSelector((state: RootState) => state.users.list);

  const getUserTotals = useCallback(
    (userId: string) => {
      const userEntries = allTimeEntries.filter(
        (entry) => entry.userId === userId
      );

      let regular = 0;
      let overtime = 0;
      const specialDays = {
        vacation: 0,
        sick: 0,
        dayoff: 0,
      };

      userEntries.forEach((entry) => {
        const direction = directions.find(
          (dir) => dir.id === entry.directionId
        );
        if (direction) {
          if (direction.isSpecial) {
            if (direction.id === "dir-vacation") specialDays.vacation++;
            else if (direction.id === "dir-sick") specialDays.sick++;
            else if (direction.id === "dir-dayoff") specialDays.dayoff++;
          } else {
            regular += entry.regular;
            overtime += entry.overtime;
          }
        }
      });

      return { regular, overtime, specialDays };
    },
    [allTimeEntries, directions]
  );

  const getUserDirectionBreakdown = useCallback(
    (userId: string) => {
      const userEntries = allTimeEntries.filter(
        (entry) => entry.userId === userId
      );
      const breakdown = new Map<
        string,
        { regular: number; overtime: number }
      >();

      userEntries.forEach((entry) => {
        const current = breakdown.get(entry.directionId) || {
          regular: 0,
          overtime: 0,
        };
        breakdown.set(entry.directionId, {
          regular: current.regular + entry.regular,
          overtime: current.overtime + entry.overtime,
        });
      });

      return breakdown;
    },
    [allTimeEntries]
  );

  const getUserEntries = useCallback(
    (userId: string) => {
      return allTimeEntries.filter((entry) => entry.userId === userId);
    },
    [allTimeEntries]
  );

  // --- Логика сохранения/редактирования ---
  const handleSave = (userToSave: User) => {
    if (!currentEmployee) return;

    if (userToSave.id) {
      dispatch(updateUser(userToSave));
    } else {
      dispatch(
        addUser({
          ...userToSave,
          id: `emp-${Date.now()}`, // Генерация ID
        })
      );
    }

    setIsDialogOpen(false);
    setCurrentEmployee(null); // ✅ Исправлено: setCurrentEmployee вместо setCurrentUser
  };

  const handleEdit = (user: User) => {
    // ✅ Убрали TODO, используем правильный тип User
    setCurrentEmployee(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(removeUser(id));
  };

  // Возвращаем логику и вычисленные функции
  return {
    users, // Список всех сотрудников
    handleSave,
    handleEdit,
    handleDelete,
    getUserTotals,
    getUserDirectionBreakdown,
    getUserEntries,
  };
};
