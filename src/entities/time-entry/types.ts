import { Category } from "../category/types";

export interface TimeEntry {
  id: string;
  date: string;
  projectId: string; // Required reference to new project structure (replaces directionId)
  userId?: string;
  regular: number;
  overtime: number;
  description?: string;
}
