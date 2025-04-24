import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="app-footer">
      <p>&copy; {{ currentYear }} Todo App. All rights reserved.</p>
    </footer>
  `,
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  constructor() {
    // Footer component logic can go here
  }
  get currentYear() {
    return new Date().getFullYear();
  }
}
