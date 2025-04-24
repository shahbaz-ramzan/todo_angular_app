import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { registerAction } from '../../store/auth/auth.actions';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  store = inject(Store);

  @Input() signupVisible: boolean = false;
  @Output() signupVisibleChange = new EventEmitter<boolean>();

  signupData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor() {}

  closeDialog() {
    this.signupVisible = false;
    this.signupVisibleChange.emit(false);
  }

  showSignupDialog() {
    this.signupVisible = true;
  }

  closeSignupDialog() {
    this.signupVisible = false;
    this.signupData = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    this.signupVisibleChange.emit(false);
  }

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
    this.signupVisibleChange.emit(false);
  }
}
