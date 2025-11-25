// src/entities/project/types.ts
export type ProjectType = "administrative" | "technical";
export type DirectionType = "administrative" | "technical";

// New Type entity to replace Directions
export interface Type {
  id: number;
  name: string;
  parentId: number | null; // null for top-level types (1-100), non-null for subtypes
}

// Updated Project structure with parent-child relationship
export interface Project {
  id: string;
  parentId: string | null; // For hierarchical structure
  name: string;
  typeId: number; // References Type.id
  shortName?: string;
}

// Old structures kept for backward compatibility during transition
export interface Direction {
  id: string;
  projectId: string; // <-- Привязка к проекту
  name: string;
  color: string;
  type: DirectionType;
  isSpecial?: boolean; // <-- Для административных направлений (отпуск, больничный и т.п.)
}

export interface OldProject {
  id: string;
  name: string;
  type: ProjectType;
  directionIds: string[]; // <-- Список ID направлений, принадлежащих проекту
  shortName?: string;
}
