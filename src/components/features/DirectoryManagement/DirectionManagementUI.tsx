// src/components/features/DirectoryManagement/DirectionManagementUI.tsx
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
import { useDirectionManagement } from "./hooks/useDirectionManagement";
import { Direction, DirectionType } from "../../../entities/project/types"; // ✅ Добавляем импорт типов

interface DirectionManagementUIProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentDirection: Direction | null; // ✅ Используем Direction вместо any
  setCurrentDirection: (direction: Direction | null) => void; // ✅ Используем Direction вместо any
}

export function DirectionManagementUI({
  isDialogOpen,
  setIsDialogOpen,
  currentDirection,
  setCurrentDirection,
}: DirectionManagementUIProps) {
  const { directions, projects, handleSave, handleEdit, handleDelete } =
    useDirectionManagement({
      isDialogOpen,
      setIsDialogOpen,
      currentDirection,
      setCurrentDirection,
    });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Направления</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Цвет</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Специальное</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {directions.map((dir) => (
                <TableRow key={dir.id}>
                  <TableCell>{dir.id}</TableCell>
                  <TableCell>{dir.name}</TableCell>
                  <TableCell>
                    <div
                      className="w-4 h-4 inline-block mr-2 rounded"
                      style={{ backgroundColor: dir.color }}
                    />
                    {dir.color}
                  </TableCell>
                  <TableCell>{dir.type}</TableCell>
                  <TableCell>{dir.isSpecial ? "Да" : "Нет"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(dir)}
                      className="mr-2"
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(dir.id)}
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
              {currentDirection?.id ? "Редактировать" : "Добавить"} направление
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Название</Label>
              <Input
                value={currentDirection?.name || ""}
                onChange={(e) =>
                  setCurrentDirection({
                    ...currentDirection!,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Цвет</Label>
              <Input
                type="color"
                value={currentDirection?.color || "#000000"}
                onChange={(e) =>
                  setCurrentDirection({
                    ...currentDirection!,
                    color: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Тип</Label>
              <Select
                value={currentDirection?.type || "technical"}
                onValueChange={(value) =>
                  setCurrentDirection({
                    ...currentDirection!,
                    type: value as DirectionType, // ✅ Используем DirectionType вместо any
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Технический</SelectItem>
                  <SelectItem value="administrative">
                    Административный
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isSpecial"
                checked={currentDirection?.isSpecial || false}
                onChange={(e) =>
                  setCurrentDirection({
                    ...currentDirection!,
                    isSpecial: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <Label htmlFor="isSpecial">Специальное (например, отпуск)</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button onClick={handleSave}>Сохранить</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
