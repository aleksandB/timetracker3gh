// src/lib/utils/migrationUtils.ts
import { Project, Direction, Type, OldProject } from "../../entities/types";
import { TimeEntry } from "../../entities/time-entry/types";
import { User } from "../../entities/user/types";

/**
 * Migration utilities to convert from old structure to new structure
 */

// Default types to create during migration
const DEFAULT_TYPES: Type[] = [
  { id: 1, name: "Административный", parentId: null },
  { id: 2, name: "Технический", parentId: null },
  { id: 3, name: "Образовательный", parentId: null },
  { id: 4, name: "Исследовательский", parentId: null },
];

/**
 * Migrate old projects to new project structure
 */
export function migrateOldProjectsToNew(
  oldProjects: OldProject[],
  directions: Direction[],
  existingTypes: Type[] = []
): { projects: Project[]; newTypes: Type[] } {
  // Create a map of direction ID to its project ID for reference
  const directionProjectMap = new Map<string, string>();
  directions.forEach(dir => {
    directionProjectMap.set(dir.id, dir.projectId);
  });

  // Create new types based on old project types if they don't exist
  const newTypes: Type[] = [];
  const allTypes = [...existingTypes, ...DEFAULT_TYPES];
  
  // Ensure we have types for the old project types
  const typeMap = new Map<string, number>(); // Maps old project type to new type ID
  oldProjects.forEach(project => {
    if (project.type === "administrative" && !allTypes.some(t => t.id === 1)) {
      if (!typeMap.has("administrative")) {
        typeMap.set("administrative", 1);
      }
    } else if (project.type === "technical" && !allTypes.some(t => t.id === 2)) {
      if (!typeMap.has("technical")) {
        typeMap.set("technical", 2);
      }
    }
  });

  // Convert old projects to new projects
  const projects: Project[] = oldProjects.map(oldProject => {
    // Find the appropriate type ID based on the old project type
    let typeId = 2; // Default to technical
    if (oldProject.type === "administrative") {
      typeId = 1;
    } else if (oldProject.type === "technical") {
      typeId = 2;
    }

    return {
      id: oldProject.id,
      parentId: null, // Old projects become root projects
      name: oldProject.name,
      typeId,
      shortName: oldProject.shortName,
    };
  });

  return { projects, newTypes };
}

/**
 * Migrate time entries to include projectId
 */
export function migrateTimeEntriesWithProjectId(
  timeEntries: any[], // Accept old time entries with directionId
  directions: Direction[]
): TimeEntry[] {
  // Create a map of direction ID to project ID
  const directionProjectMap = new Map<string, string>();
  directions.forEach(direction => {
    directionProjectMap.set(direction.id, direction.projectId);
  });

  // Update time entries to include projectId
  return timeEntries.map((entry: any) => {
    const projectId = directionProjectMap.get(entry.directionId);
    return {
      id: entry.id,
      date: entry.date,
      projectId: projectId || 'unknown-project', // Default to 'unknown-project' if mapping fails
      userId: entry.userId,
      regular: entry.regular,
      overtime: entry.overtime,
      description: entry.description,
    };
  }).filter(entry => entry.projectId !== 'unknown-project'); // Filter out entries that couldn't be mapped
}

/**
 * Migrate users to include projectIds array
 */
export function migrateUsersWithProjectIds(
  users: User[],
  projects: Project[]
): User[] {
  // For now, assign all users to all projects as a default
  // In a real migration, this would be more sophisticated
  return users.map(user => ({
    ...user,
    projectIds: projects.map(p => p.id),
  }));
}

/**
 * Complete migration from old structure to new structure
 */
export function performFullMigration(
  oldProjects: OldProject[],
  directions: Direction[],
  timeEntries: TimeEntry[],
  users: User[],
  existingTypes: Type[] = []
): {
  projects: Project[];
  directions: Direction[];
  timeEntries: TimeEntry[];
  users: User[];
  types: Type[];
} {
  // Migrate projects and types
  const { projects, newTypes } = migrateOldProjectsToNew(oldProjects, directions, existingTypes);
  
  // Add default types if they don't exist yet
  const allTypes = [...existingTypes, ...newTypes, ...DEFAULT_TYPES.filter(
    defaultType => !existingTypes.some(existingType => existingType.id === defaultType.id)
  )];

  // Migrate time entries to include projectId
  const migratedTimeEntries = migrateTimeEntriesWithProjectId(timeEntries, directions);

  // Migrate users to include projectIds
  const migratedUsers = migrateUsersWithProjectIds(users, projects);

  return {
    projects,
    directions: [], // Remove directions completely after migration
    timeEntries: migratedTimeEntries,
    users: migratedUsers,
    types: allTypes,
  };
}

/**
 * Check if migration is needed
 */
export function isMigrationNeeded(
  projects: Project[],
  oldProjects: OldProject[],
  types: Type[]
): boolean {
  // Migration is needed if we have old projects but no new projects or types
  return oldProjects.length > 0 && (projects.length === 0 || types.length === 0);
}