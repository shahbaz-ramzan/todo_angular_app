import { createReducer, on } from '@ngrx/store';

import * as tasksActions from './tasks.actions';

export interface TasksState {
  tasks: any;
  loading: boolean;
  error: any;
}

export const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const tasksReducer = createReducer(
  initialState,
  on(tasksActions.loadTasks, (state) => ({
    ...state,
    loading: true,
  })),
  on(tasksActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
  })),
  on(tasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(tasksActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: Array.isArray(state.tasks)
      ? state.tasks.filter((task: any) => task.id !== id)
      : [],
  })),
  on(tasksActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(tasksActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
  })),
  on(tasksActions.createTaskFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
