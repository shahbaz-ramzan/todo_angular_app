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
import {
  loadTasks,
} from './store/tasks/tasks.actions';
import { Store } from '@ngrx/store';
import {
  checkAuthFromCookie,
} from './store/auth/auth.actions';
import { CookieService } from 'ngx-cookie-service';
import { HeaderComponent } from './components/header/header.component';
import { ListComponent } from './components/list/list.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';

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
    ListComponent,
    FooterComponent,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isValidUser: boolean = false;

  store = inject(Store);
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
