import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { createTask, deleteTask, loadTasks, updateTask } from './store/tasks/tasks.actions';
// import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { loginAction } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  taskId: string = '';
  dialogTitle : string = '';
  btnText :string = '';
  email: string = '';
  password: string = '';
  store = inject(Store);
  tasks$ = this.store.select((state: any) => state.tasks.tasks) || [];
  user$ = this.store.select((state: any) => state.user) || [];

  constructor() {}
  ngOnInit(): void {
    this.store.dispatch(loadTasks());
    console.log(this.tasks$);
  }

  login() {
    this.store.dispatch(
      loginAction({ user: { email: this.email, password: this.password } })
    );
    this.store.dispatch(loadTasks());
    this.loginVisible = false;
  }

  visible: boolean = false;
  loginVisible: boolean = false;

  task = {
    title: '',
    description: '',
    label: { name: '', code: '' },
  };

  labels = [
    { name: 'To Do', code: 'todo' },
    { name: 'In Progress', code: 'inProgress' },
    { name: 'Completed', code: 'completed' },
  ];

  showDialog(arg: any) {
    this.resetForm();
    if (arg === 'add') {
      this.dialogTitle = 'Add New Task';
      this.btnText = 'Save';
    } else {
      this.dialogTitle = 'Edit Task';
      this.btnText = 'Update';
    }
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  addTask() {
    const payload = {
      title: this.task.title,
      description: this.task.description,
      status: this.task.label?.code,
    };
  
    if (this.btnText === 'Save') {
      this.store.dispatch(createTask({ task: payload }));
    } else {
      this.store.dispatch(updateTask({ task: { ...payload, id: this.taskId } }));
    }
  
    this.closeDialog();
  }
  

  resetForm() {
    this.task = {
      title: '',
      description: '',
      label: { name: '', code: '' },
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

    console.log('Editing task:', this.task);
  }

  deleteTask(id: string) {
    this.store.dispatch(deleteTask({ id: id }));
  }
  closeLoginDialog() {
    this.loginVisible = false;
  }
  showLoginDialog() {
    this.loginVisible = true;
  }
}
