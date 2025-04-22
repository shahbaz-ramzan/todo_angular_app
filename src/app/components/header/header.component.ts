import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="app-header">
      <h1>Todo App</h1>
    </header>
  `,
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {}
