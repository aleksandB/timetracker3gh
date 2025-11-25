// src/entities/types.ts
// Объединяем все типы в один файл для удобства импорта

export type { User } from "./user/types";
export type { Category, CategoryType } from "./category/types";
export type {
  Direction,
  Project,
  ProjectType,
  DirectionType,
} from "./project/types";
export type { TimeEntry } from "./time-entry/types";
