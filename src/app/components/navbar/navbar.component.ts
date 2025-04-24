import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a class="navbar-brand" href="#">Todo App</a>
        <ul class="navbar-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Tasks</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {}
