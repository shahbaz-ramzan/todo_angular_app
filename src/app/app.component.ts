import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { deleteTask, loadTasks } from './store/tasks/tasks.actions';
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
  dialogTitle = '';
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
    this.store.dispatch(loginAction({ user: { email: this.email, password: this.password } }));
    this.store.dispatch(loadTasks());
    this.loginVisible = false;
  }

  visible: boolean = false;
  loginVisible: boolean = false;

  task = {
    title: '',
    description: '',
    label: null,
  };

  labels = [
    { name: 'Work', code: 'WORK' },
    { name: 'Personal', code: 'PERSONAL' },
    { name: 'Urgent', code: 'URGENT' },
  ];

  showDialog(arg: any) {
    if (arg === 'add') {
      this.dialogTitle = 'Add New Task';
    } else {
      this.dialogTitle = 'Edit Task';
    }
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  addTask() {
    console.log('Task to add:', this.task);
    this.closeDialog();
  }

  resetForm() {
    this.task = {
      title: '',
      description: '',
      label: null,
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
    console.log('Editing task:', task);
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
