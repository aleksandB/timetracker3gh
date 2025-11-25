// src/components/features/DirectoryManagement/ProjectManagementUI.tsx
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
import { useProjectManagement } from "./hooks/useProjectManagement";
import { Project, Type } from "../../../entities/project/types"; // ✅ Добавляем импорт типов

interface ProjectManagementUIProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentProject: Project | null; // ✅ Используем Project вместо any
  setCurrentProject: (project: Project | null) => void; // ✅ Используем Project вместо any
}

export function ProjectManagementUI({
  isDialogOpen,
  setIsDialogOpen,
  currentProject,
  setCurrentProject,
}: ProjectManagementUIProps) {
  const {
    projects,
    directions,
    types,
    selectedDirectionIds,
    setSelectedDirectionIds,
    handleSave,
    handleEdit,
    handleDelete,
  } = useProjectManagement({
    isDialogOpen,
    setIsDialogOpen,
    currentProject,
    setCurrentProject,
  });

  // Функция для получения названия типа по ID
  const getTypeName = (typeId: number) => {
    const type = types.find(t => t.id === typeId);
    return type ? type.name : 'Неизвестный тип';
  };

  // Функция для получения родительского проекта по ID
  const getParentProjectName = (parentId: string | null) => {
    if (!parentId) return 'Нет (корневой проект)';
    const parentProject = projects.find(p => p.id === parentId);
    return parentProject ? parentProject.name : 'Неизвестный проект';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Проекты</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Родительский проект</TableHead>
                <TableHead>Краткое имя</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((proj) => (
                <TableRow key={proj.id}>
                  <TableCell>{proj.id}</TableCell>
                  <TableCell>{proj.name}</TableCell>
                  <TableCell>{getTypeName(proj.typeId)}</TableCell>
                  <TableCell>{getParentProjectName(proj.parentId)}</TableCell>
                  <TableCell>{proj.shortName || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(proj)}
                      className="mr-2"
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(proj.id)}
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
              {currentProject?.id ? "Редактировать" : "Добавить"} проект
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Название</Label>
              <Input
                value={currentProject?.name || ""}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject!,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Краткое имя</Label>
              <Input
                value={currentProject?.shortName || ""}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject!,
                    shortName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Тип</Label>
              <Select
                value={currentProject?.typeId?.toString() || "2"}
                onValueChange={(value) =>
                  setCurrentProject({
                    ...currentProject!,
                    typeId: Number(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Родительский проект</Label>
              <Select
                value={currentProject?.parentId || "null"}
                onValueChange={(value) =>
                  setCurrentProject({
                    ...currentProject!,
                    parentId: value === "null" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Нет (корневой проект)</SelectItem>
                  {projects
                    .filter(p => p.id !== currentProject?.id) // Исключаем текущий проект из списка родителей
                    .map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
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
