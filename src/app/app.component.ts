import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import {
  clearTasks,
  createTask,
  deleteTask,
  loadTasks,
  updateTask,
} from './store/tasks/tasks.actions';
import { Store } from '@ngrx/store';
import {
  checkAuthFromCookie,
  loginAction,
  logout,
  registerAction,
} from './store/auth/auth.actions';
import { CookieService } from 'ngx-cookie-service';
import { HeaderComponent } from './components/header/header.component';

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
    ConfirmDialogModule,
    HeaderComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  // Authentication-related properties
  email: string = '';
  password: string = '';
  isValidUser: boolean = false;

  // Dialog-related properties
  visible: boolean = false;
  loginVisible: boolean = false;
  signupVisible = false;

  // Task-related properties
  taskId: string = '';
  dialogTitle: string = '';
  btnText: string = '';
  task = { title: '', description: '', label: { name: '', code: '' } };
  labels = [
    { name: 'To Do', code: 'todo' },
    { name: 'In Progress', code: 'inProgress' },
    { name: 'Completed', code: 'completed' },
  ];

  // Signup-related properties
  signupData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Store and observables
  store = inject(Store);
  confirmationService = inject(ConfirmationService);
  tasks$ = this.store.select((state: any) => state.tasks.tasks) || [];
  user$ = this.store.select((state: any) => state.user) || [];

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    this.initializeAuthState();
    
    const authToken = this.cookieService.get('authToken');
    this.isValidUser = !!authToken;
  
    if (this.isValidUser) {
      this.store.dispatch(loadTasks());
    }
  }
  

  // ngOnInit(): void {
  //   this.initializeAuthState();
  //   this.store.dispatch(loadTasks());

  //   const authToken = this.cookieService.get('authToken');
  //   if (authToken) {
  //     this.isValidUser = true;
  //   } else {
  //     this.isValidUser = false;
  //   }
  // }

  // Authentication methods
  initializeAuthState() {
    const token = this.cookieService.get('authToken');
    this.store
      .select((state: any) => state.auth)
      .subscribe((authState) => {
        this.isValidUser = authState?.isValidUser;
      });

    this.store.dispatch(checkAuthFromCookie());
  }

  login() {
    if (!this.email || !this.password) {
      alert('Please enter email and password.');
      return;
    }
    this.store.dispatch(
      loginAction({ user: { email: this.email, password: this.password } })
    );
    this.loginVisible = false;
  }

  logout() {
    this.cookieService.delete('authToken');
    this.store.dispatch(logout());
    this.store.dispatch(clearTasks()); 
    // this.store.dispatch(loadTasks());
  }

  // Task-related methods
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
      this.store.dispatch(
        updateTask({ task: { ...payload, id: this.taskId } })
      );
    }

    this.closeDialog();
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

  // Dialog methods
  closeLoginDialog() {
    this.loginVisible = false;
  }

  showLoginDialog() {
    this.loginVisible = true;
  }

  showSignupDialog() {
    this.signupVisible = true;
  }

  // Signup methods
  isSignupFormValid() {
    const { username, email, password, confirmPassword } = this.signupData;
    return (
      username &&
      email &&
      password &&
      confirmPassword &&
      password === confirmPassword
    );
  }

  signup() {
    if (!this.isSignupFormValid()) {
      alert('Please fill all fields correctly.');
      return;
    }
    this.store.dispatch(registerAction({ user: this.signupData }));
    this.signupVisible = false;
  }
}
