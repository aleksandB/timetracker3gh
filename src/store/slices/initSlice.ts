// src/store/slices/initSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../entities/user/types";
import { Project, Direction, Type } from "../../entities/types";
import { TimeEntry } from "../../entities/types";
import { setProjects, setDirections, setTypes } from "./projectSlice";
import { setTimeEntries } from "./timeEntrySlice";
import { setUsers } from "./userSlice";

interface InitialData {
  users: User[];
  projects: Project[];
  directions: Direction[];
  types: Type[];
  timeEntries: TimeEntry[];
}

interface InitState {
  loading: boolean;
  error: string | null;
}

const initialState: InitState = {
  loading: false,
  error: null,
};

const initSlice = createSlice({
  name: "init",
  initialState,
  reducers: {
    loadDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadDataSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    loadDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    saveDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    saveDataSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    saveDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loadDataStart,
  loadDataSuccess,
  loadDataFailure,
  saveDataStart,
  saveDataSuccess,
  saveDataFailure,
} = initSlice.actions;

export default initSlice.reducer;

// Async thunk для загрузки данных
// ⚠️ ВРЕМЕННО: Используем any для dispatch, в Фазе 3 будет переделано на createAsyncThunk
export const loadData = (jsonData: InitialData) => (dispatch: any) => {
  dispatch(loadDataStart());

  try {
    // 1. Загружаем пользователей (включая админа)
    dispatch(setUsers(jsonData.users));
    // Если у вас есть отдельный слайс для текущего пользователя, возможно, нужно обновить его

    // 2. Загружаем типы (новая структура)
    dispatch(setTypes(jsonData.types || []));

    // 3. Загружаем проекты
    dispatch(setProjects(jsonData.projects));

    // 4. Загружаем направления
    dispatch(setDirections(jsonData.directions));

    // 5. Загружаем записи времени
    dispatch(setTimeEntries(jsonData.timeEntries));

    dispatch(loadDataSuccess());
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    dispatch(loadDataFailure("Ошибка при загрузке данных"));
  }
};

// Async thunk для сохранения данных
// ⚠️ ВРЕМЕННО: Используем any для dispatch и getState, в Фазе 3 будет переделано на createAsyncThunk
export const saveData = () => (dispatch: any, getState: any) => {
  dispatch(saveDataStart());

  try {
    const state = getState();
    const dataToSave: InitialData = {
      users: state.users.list,
      projects: state.projects.projects,
      directions: state.projects.directions,
      types: state.projects.types,
      timeEntries: state.timeEntries,
    };

    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    dispatch(saveDataSuccess());
  } catch (error) {
    console.error("Ошибка при сохранении данных:", error);
    dispatch(saveDataFailure("Ошибка при сохранении данных"));
  }
};
