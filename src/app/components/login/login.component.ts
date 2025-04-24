import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Button } from 'antd';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { loginAction } from '../../store/auth/auth.actions';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,DialogModule,ButtonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
@Input() loginVisible: boolean = false;
@Input() email: string = '';
@Input() password: string = '';

@Output() loginVisibleChange = new EventEmitter<boolean>();

store = inject(Store);

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

  closeLoginDialog() {
    this.loginVisible = false;
    this.loginVisibleChange.emit(false);
  }
}
