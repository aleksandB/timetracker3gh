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
import { Project, ProjectType } from "../../../entities/project/types"; // ✅ Добавляем импорт типов

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
                <TableHead>Количество направлений</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((proj) => (
                <TableRow key={proj.id}>
                  <TableCell>{proj.id}</TableCell>
                  <TableCell>{proj.name}</TableCell>
                  <TableCell>{proj.type}</TableCell>
                  <TableCell>{proj.directionIds?.length || 0}</TableCell>
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
              <Label>Тип</Label>
              <Select
                value={currentProject?.type || "technical"}
                onValueChange={(value) =>
                  setCurrentProject({
                    ...currentProject!,
                    type: value as ProjectType, // ✅ Используем ProjectType вместо any
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
            <div>
              <Label>Направления</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                {directions.map((dir) => (
                  <div key={dir.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`dir-checkbox-${dir.id}`}
                      checked={selectedDirectionIds.includes(dir.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDirectionIds([
                            ...selectedDirectionIds,
                            dir.id,
                          ]);
                        } else {
                          setSelectedDirectionIds(
                            selectedDirectionIds.filter((id) => id !== dir.id)
                          );
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`dir-checkbox-${dir.id}`}>
                      {dir.name} ({dir.type})
                    </label>
                  </div>
                ))}
              </div>
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
