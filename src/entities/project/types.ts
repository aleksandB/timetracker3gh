// src/entities/project/types.ts
export type ProjectType = "administrative" | "technical";
export type DirectionType = "administrative" | "technical";

export interface Direction {
  id: string;
  projectId: string; // <-- Привязка к проекту
  name: string;
  color: string;
  type: DirectionType;
  isSpecial?: boolean; // <-- Для административных направлений (отпуск, больничный и т.п.)
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  directionIds: string[]; // <-- Список ID направлений, принадлежащих проекту
  shortName?: string;
}
