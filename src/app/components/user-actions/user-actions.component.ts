import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { ButtonModule } from 'primeng/button';
import { checkAuthFromCookie, logout } from '../../store/auth/auth.actions';
import { clearTasks } from '../../store/tasks/tasks.actions';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { AddEditDialogComponent } from '../add-edit-dialog/add-edit-dialog.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-user-actions',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    AddEditDialogComponent,
    SignUpComponent,
    LoginComponent,
  ],
  templateUrl: './user-actions.component.html',
  styleUrl: './user-actions.component.css',
})
export class UserActionsComponent {
  task = { title: '', description: '', label: { name: '', code: '' } };
  dialogTitle: string = '';
  btnText: string = '';
  taskId: string = '';
  visible: boolean = false;
  loginVisible: boolean = false;
  signupVisible: boolean = false;

  store = inject(Store);

  // isValidUser: boolean = false;
  labels = [
    { name: 'To Do', code: 'todo' },
    { name: 'In Progress', code: 'inprogress' },
    { name: 'Completed', code: 'completed' },
  ];

  @Input() isValidUser: boolean = false;
  // @Input() visible: boolean = false;

  // @Output() visibleChange = new EventEmitter<boolean>();

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    this.initializeAuthState();
    const authToken = this.cookieService.get('authToken');
    this.isValidUser = !!authToken;
  }

  resetForm() {
    this.task = { title: '', description: '', label: { name: '', code: '' } };
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
    this.visible = true; // Update the visible property
  }

  showSignupDialog() {
    if (!this.signupVisible) {
      // Ensure the dialog is not already open
      this.signupVisible = true;
    }
  }

  showLoginDialog() {
    this.loginVisible = true;
  }

  signupVisibleChange() {
    this.signupVisible = false; // Close the dialog
    this.resetForm(); // Reset the form data
  }
  loginVisibleChange() {
    this.loginVisible = false; // Close the dialog
    this.resetForm(); // Reset the form data
  }

  logout() {
    this.cookieService.delete('authToken');
    this.store.dispatch(logout());
    this.store.dispatch(clearTasks());
  }

  closeDialog() {
    // this.visibleChange.emit(false);
    this.signupVisible = false; // Reset the signupVisible property
    this.resetForm();
  }

  initializeAuthState() {
    const token = this.cookieService.get('authToken');
    this.store
      .select((state: any) => state.auth)
      .subscribe((authState) => {
        this.isValidUser = authState?.isValidUser;
      });

    this.store.dispatch(checkAuthFromCookie());
  }
}
