export type UserRole = "employee" | "manager" | "admin";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  position?: string;
  avatar?: string;
  projectIds?: string[]; // Array of project IDs assigned to the user
}
