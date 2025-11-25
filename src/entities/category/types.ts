export type CategoryType = 'project' | 'vacation' | 'sick' | 'dayoff';

export interface Category {
  id: string;
  name: string;
  shortName: string;
  color: string;
  type: CategoryType;
  client?: string;
  isSpecial?: boolean; // true for vacation, sick, dayoff
}
