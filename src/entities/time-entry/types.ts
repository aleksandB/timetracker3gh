import { Category } from "../category/types";

export interface TimeEntry {
  id: string;
  date: string;
  directionId: string;
  projectId?: string; // Optional reference to new project structure
  userId?: string;
  regular: number;
  overtime: number;
  description?: string;
}
