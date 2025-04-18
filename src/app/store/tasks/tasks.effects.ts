import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as TasksActions from './tasks.actions';
import { TASK_ENDPOINTS } from '../../constants/api-endpoint';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class TasksEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      mergeMap(() =>
        this.http.get(TASK_ENDPOINTS.GET_ALL).pipe(
          map((res: any) => TasksActions.loadTasksSuccess({ tasks: res.data })),
          catchError((error) => of(TasksActions.loadTasksFailure({ error })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      mergeMap(({ id }) => {
        const token = this.cookieService.get('authToken');
        const headers = { Authorization: `Bearer ${token}` };

        return this.http.delete(TASK_ENDPOINTS.DELETE(id), { headers }).pipe(
          map(() => TasksActions.deleteTaskSuccess({ id })),
          catchError((error) => of(TasksActions.deleteTaskFailure({ error })))
        );
      })
    )
  );

  reloadTasksAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTaskSuccess),
      map(() => TasksActions.loadTasks())
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTask),
      mergeMap(({ task }) => {
        const token = this.cookieService.get('authToken');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post(TASK_ENDPOINTS.CREATE, task, { headers }).pipe(
          map(() => TasksActions.createTaskSuccess(task)),
          catchError((error) => of(TasksActions.createTaskFailure({ error })))
        );
      })
    )
  );

  reloadTasksAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTaskSuccess),
      map(() => TasksActions.loadTasks())
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTask),
      mergeMap(({ task }) => {
        const token = this.cookieService.get('authToken');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.put(TASK_ENDPOINTS.UPDATE(task.id), task, { headers }).pipe(
          map(() => TasksActions.updateTaskSuccess(task)),
          catchError((error) => of(TasksActions.updateTaskFailure({ error })))
        );
      })
    )
  );

  reloadTasksAfterUpdatge$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTaskSuccess),
      map(() => TasksActions.loadTasks())
    )
  );
}
