import { createAction,props } from "@ngrx/store";

export const loadTasks = createAction('[Tasks] Load Tasks');
export const loadTasksSuccess = createAction(
    '[Tasks] Load Tasks Success',
    props<{ tasks: any[] }>()
);
export const loadTasksFailure = createAction(
    '[Tasks] Load Tasks Failure',
    props<{ error: any }>()
);

export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ id: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Tasks] Delete Task Success',
  props<{ id: string }>()
);

export const deleteTaskFailure = createAction( 
  '[Tasks] Delete Task Failure',
  props<{ error: any }>()
);