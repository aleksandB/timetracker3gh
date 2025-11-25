import { Category } from "../category/types";

export interface TimeEntry {
  id: string;
  date: string;
  directionId: string;
  userId?: string;
  regular: number;
  overtime: number;
  description?: string;
}
