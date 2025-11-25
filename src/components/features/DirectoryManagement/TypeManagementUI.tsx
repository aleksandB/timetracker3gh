// src/components/features/DirectoryManagement/TypeManagementUI.tsx
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
import { Type } from "../../../entities/project/types";

interface TypeManagementUIProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentType: Type | null;
  setCurrentType: (type: Type | null) => void;
  types: Type[];
  handleSave: () => void;
  handleEdit: (type: Type) => void;
  handleDelete: (id: number) => void;
}

export function TypeManagementUI({
  isDialogOpen,
  setIsDialogOpen,
  currentType,
  setCurrentType,
  types,
  handleSave,
  handleEdit,
  handleDelete,
}: TypeManagementUIProps) {
  // Функция для получения родительского типа по ID
  const getParentTypeName = (parentId: number | null) => {
    if (parentId === null) return 'Нет (корневой тип)';
    const parentType = types.find(t => t.id === parentId);
    return parentType ? parentType.name : 'Неизвестный тип';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Типы</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Родительский тип</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.id}</TableCell>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{getParentTypeName(type.parentId)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(type)}
                      className="mr-2"
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(type.id)}
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
              {currentType?.id ? "Редактировать" : "Добавить"} тип
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>ID</Label>
              <Input
                type="number"
                value={currentType?.id || ""}
                onChange={(e) =>
                  setCurrentType({
                    ...currentType!,
                    id: Number(e.target.value),
                  })
                }
                disabled={!!currentType?.id} // ID нельзя менять после создания
              />
            </div>
            <div>
              <Label>Название</Label>
              <Input
                value={currentType?.name || ""}
                onChange={(e) =>
                  setCurrentType({
                    ...currentType!,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Родительский тип</Label>
              <Select
                value={currentType?.parentId?.toString() || "null"}
                onValueChange={(value) =>
                  setCurrentType({
                    ...currentType!,
                    parentId: value === "null" ? null : Number(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Нет (корневой тип)</SelectItem>
                  {types
                    .filter(t => t.id !== currentType?.id) // Исключаем текущий тип из списка родителей
                    .map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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