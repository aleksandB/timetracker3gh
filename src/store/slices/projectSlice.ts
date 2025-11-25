import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Project,
  Direction  
} from "../../entities/types";

interface ProjectState {
  projects: Project[];
  directions: Direction[];
}

const initialState: ProjectState = {
  projects: [],
  directions: [],
};

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setDirections: (state, action: PayloadAction<Direction[]>) => {
      state.directions = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    addDirection: (state, action: PayloadAction<Direction>) => {
      state.directions.push(action.payload);
      // Добавим ID направления в проект
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId
      );
      if (project && !project.directionIds.includes(action.payload.id)) {
        project.directionIds.push(action.payload.id);
      }
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
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
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      // Удалим все направления этого проекта
      state.directions = state.directions.filter(
        (d) => d.projectId !== action.payload
      );
    },
    removeDirection: (state, action: PayloadAction<string>) => {
      state.directions = state.directions.filter(
        (d) => d.id !== action.payload
      );
      // Удалим ID направления из проекта
      const project = state.projects.find((p) =>
        p.directionIds.includes(action.payload)
      );
      if (project) {
        project.directionIds = project.directionIds.filter(
          (id) => id !== action.payload
        );
      }
    },
  },
});

export const {
  setProjects,
  setDirections,
  addProject,
  addDirection,
  updateProject,
  updateDirection,
  removeProject,
  removeDirection,
} = projectSlice.actions;
export default projectSlice;
