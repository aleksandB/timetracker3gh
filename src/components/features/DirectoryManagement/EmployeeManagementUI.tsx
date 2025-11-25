// src/components/features/DirectoryManagement/EmployeeManagementUI.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../ui/table";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { useEmployeeManagement } from "./hooks/useEmployeeManagement";
import { User } from "../../../entities/user/types";

interface EmployeeManagementUIProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentEmployee: User | null;
  setCurrentEmployee: (user: User | null) => void;
}

export function EmployeeManagementUI({
  isDialogOpen,
  setIsDialogOpen,
  currentEmployee,
  setCurrentEmployee,
}: EmployeeManagementUIProps) {
  const [formUser, setFormUser] = useState<User | null>(null);

  useEffect(() => {
    setFormUser(currentEmployee);
  }, [currentEmployee]);

  const {
    users,
    handleSave,
    handleEdit,
    handleDelete,
    getUserTotals,
    getUserDirectionBreakdown,
    getUserEntries,
  } = useEmployeeManagement({
    isDialogOpen,
    setIsDialogOpen,
    currentEmployee: formUser,
    setCurrentEmployee: setFormUser,
  });

  const handleSaveLocal = () => {
    if (formUser) {
      handleSave(formUser); // Передаём formUser в логику
      setIsDialogOpen(false);
      setFormUser(null); // Сбрасываем локальное состояние
      setCurrentEmployee(null); // Сбрасываем пропс
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Сотрудники</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Имя Фамилия</TableHead>
                <TableHead>Должность</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="mr-2"
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formUser?.id ? "Редактировать" : "Добавить"} сотрудника
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Имя</Label>
              <Input
                value={formUser?.name || ""}
                onChange={(e) =>
                  setFormUser({
                    ...formUser!,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Должность</Label>
              <Input
                value={formUser?.position || ""}
                onChange={(e) =>
                  setFormUser({
                    ...formUser!,
                    position: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Роль</Label>
              <Select
                value={formUser?.role || "employee"}
                onValueChange={(value) =>
                  setFormUser({
                    ...formUser!,
                    role: value as any,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Сотрудник</SelectItem>
                  <SelectItem value="manager">Менеджер</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button onClick={handleSaveLocal}>Сохранить</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
