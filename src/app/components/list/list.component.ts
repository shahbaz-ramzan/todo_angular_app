import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmationService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { deleteTask } from '../../store/tasks/tasks.actions';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AddEditDialogComponent } from '../add-edit-dialog/add-edit-dialog.component';
import { UserActionsComponent } from '../user-actions/user-actions.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    CommonModule,
    ConfirmDialogModule,
    AddEditDialogComponent,
    UserActionsComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  store = inject(Store);
  // confirmationService = inject(ConfirmationService);
  tasks$ = this.store.select((state: any) => state.tasks.tasks) || [];
  task = { title: '', description: '', label: { name: '', code: '' } };
  dialogTitle: string = '';
  btnText: string = '';
  taskId: string = '';
  visible: boolean = false;
  isValidUser: boolean = false;
  labels = [
    { name: 'To Do', code: 'todo' },
    { name: 'In Progress', code: 'inprogress' },
    { name: 'Completed', code: 'completed' },
  ];
  cookieService = inject(CookieService);

  constructor(private confirmationService: ConfirmationService) {}
  ngOnInit(): void {
    this.initializeAuthState();
    const authToken = this.cookieService.get('authToken');
    this.isValidUser = !!authToken;
  }
  initializeAuthState() {
    const token = this.cookieService.get('authToken');
    this.isValidUser = !!token;
  }
  confirmDelete(taskId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this task?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(deleteTask({ id: taskId }));
      },
    });
  }
  resetForm() {
    this.task = { title: '', description: '', label: { name: '', code: '' } };
  }

  visibleChange() {
    this.visible = false; // Close the dialog
    this.resetForm(); // Reset the form data
  }
  showDialog(arg: 'add' | 'edit') {
    this.resetForm();
    this.dialogTitle = arg === 'add' ? 'Add New Task' : 'Edit Task';
    this.btnText = arg === 'add' ? 'Save' : 'Update';
    if (arg === 'add') {
      this.task.label = this.labels.find((label) => label.code === 'todo') || {
        name: '',
        code: '',
      };
    }
    this.visible = true;
  }
  editTask(task: any) {
    this.showDialog('edit');
    const labelObj = this.labels.find(
      (label) => label.code === task.status
    ) || { name: '', code: '' };
    this.taskId = task._id;
    this.task = {
      title: task.title,
      description: task.description,
      label: labelObj,
    };
  }

  getSeverity(
    status: string
  ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case 'completed':
        return 'success';
      case 'todo':
        return 'info';
      case 'inprogress':
        return 'warning';
      default:
        return 'secondary';
    }
  }
}
