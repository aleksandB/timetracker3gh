// src/components/features/DirectoryManagement/index.tsx
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { EmployeeManagementUI } from "./EmployeeManagementUI";
import { DirectionManagementUI } from "./DirectionManagementUI";
import { ProjectManagementUI } from "./ProjectManagementUI";
import { User } from "../../../entities/user/types";
import { Project, Direction } from "../../../entities/types"; // ✅ Добавляем импорт типов

interface DirectoryManagementProps {
  currentUser: User;
}

export function DirectoryManagement() {
  const [activeTab, setActiveTab] = useState<
    "employees" | "directions" | "projects"
  >("employees");

  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<User | null>(null);

  const [directionDialogOpen, setDirectionDialogOpen] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<Direction | null>(null); // ✅ Используем Direction вместо any

  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null); // ✅ Используем Project вместо any

  const openAddEmployeeDialog = () => {
    setCurrentEmployee(null);
    setEmployeeDialogOpen(true);
  };

  const openAddDirectionDialog = () => {
    setCurrentDirection(null);
    setDirectionDialogOpen(true);
  };

  const openAddProjectDialog = () => {
    setCurrentProject(null);
    setProjectDialogOpen(true);
  };

  const getHandleAdd = () => {
    switch (activeTab) {
      case "employees":
        return openAddEmployeeDialog;
      case "directions":
        return openAddDirectionDialog;
      case "projects":
        return openAddProjectDialog;
      default:
        return () => {};
    }
  };

  const handleAddNew = getHandleAdd();

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Справочники</h1>
        <Button onClick={handleAddNew}>
          + Добавить{" "}
          {activeTab === "employees"
            ? "сотрудника"
            : activeTab === "directions"
            ? "направление"
            : "проект"}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "employees" | "directions" | "projects")} // ✅ Используем правильный тип вместо any
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="employees">Сотрудники</TabsTrigger>
          <TabsTrigger value="directions">Направления</TabsTrigger>
          <TabsTrigger value="projects">Проекты</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Передаём стейты и сеттеры в UI компоненты */}
      {activeTab === "employees" && (
        <EmployeeManagementUI
          isDialogOpen={employeeDialogOpen}
          setIsDialogOpen={setEmployeeDialogOpen}
          currentEmployee={currentEmployee}
          setCurrentEmployee={setCurrentEmployee}
        />
      )}
      {activeTab === "directions" && (
        <DirectionManagementUI
          isDialogOpen={directionDialogOpen}
          setIsDialogOpen={setDirectionDialogOpen}
          currentDirection={currentDirection}
          setCurrentDirection={setCurrentDirection}
        />
      )}
      {activeTab === "projects" && (
        <ProjectManagementUI
          isDialogOpen={projectDialogOpen}
          setIsDialogOpen={setProjectDialogOpen}
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
        />
      )}
    </div>
  );
}
