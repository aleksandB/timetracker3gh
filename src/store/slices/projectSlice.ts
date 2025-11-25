import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Project,
  Direction,
  Type,
  OldProject
} from "../../entities/types";

interface ProjectState {
  projects: Project[]; // New projects with hierarchical structure
  oldProjects: OldProject[]; // Old projects for backward compatibility
  directions: Direction[]; // Old directions for backward compatibility
  types: Type[]; // New types replacing directions
}

const initialState: ProjectState = {
  projects: [],
  oldProjects: [],
  directions: [],
  types: [],
};

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    // New types management
    setTypes: (state, action: PayloadAction<Type[]>) => {
      state.types = action.payload;
    },
    addType: (state, action: PayloadAction<Type>) => {
      state.types.push(action.payload);
    },
    updateType: (state, action: PayloadAction<Type>) => {
      const index = state.types.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.types[index] = action.payload;
      }
    },
    removeType: (state, action: PayloadAction<number>) => {
      state.types = state.types.filter((t) => t.id !== action.payload);
    },
    
    // New projects management
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
    
    // Old projects management (for backward compatibility)
    setOldProjects: (state, action: PayloadAction<OldProject[]>) => {
      state.oldProjects = action.payload;
    },
    addOldProject: (state, action: PayloadAction<OldProject>) => {
      state.oldProjects.push(action.payload);
    },
    updateOldProject: (state, action: PayloadAction<OldProject>) => {
      const index = state.oldProjects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.oldProjects[index] = action.payload;
      }
    },
    removeOldProject: (state, action: PayloadAction<string>) => {
      state.oldProjects = state.oldProjects.filter((p) => p.id !== action.payload);
    },
    
    // Old directions management (for backward compatibility)
    setDirections: (state, action: PayloadAction<Direction[]>) => {
      state.directions = action.payload;
    },
    addDirection: (state, action: PayloadAction<Direction>) => {
      state.directions.push(action.payload);
      // Добавим ID направления в проект
      const project = state.oldProjects.find(
        (p) => p.id === action.payload.projectId
      );
      if (project && !project.directionIds.includes(action.payload.id)) {
        project.directionIds.push(action.payload.id);
      }
    },
    updateDirection: (state, action: PayloadAction<Direction>) => {
      const index = state.directions.findIndex(
        (d) => d.id === action.payload.id
      );
      if (index !== -1) {
        state.directions[index] = action.payload;
      }
    },
    removeDirection: (state, action: PayloadAction<string>) => {
      state.directions = state.directions.filter(
        (d) => d.id !== action.payload
      );
      // Удалим ID направления из проекта
      const project = state.oldProjects.find((p) =>
        p.directionIds.includes(action.payload)
      );
      if (project) {
        project.directionIds = project.directionIds.filter(
          (id) => id !== action.payload
        );
      }
    },

    // Migration completion action - clears old structures after successful migration
    completeMigration: (state) => {
      state.oldProjects = []; // Clear old projects after migration
      state.directions = []; // Clear directions after migration
    },
  },
});

export const {
  setProjects,
  setOldProjects,
  setDirections,
  setTypes,
  addProject,
  addOldProject,
  addDirection,
  addType,
  updateProject,
  updateOldProject,
  updateDirection,
  updateType,
  removeProject,
  removeOldProject,
  removeDirection,
  removeType,
} = projectSlice.actions;
export default projectSlice;
