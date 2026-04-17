import { Component, inject } from '@angular/core';
import { SidebarState } from '../sidebar.state';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  template: `
    <header class="mobile-header">
      <button class="menu-toggle" type="button" (click)="state.toggle()" aria-label="Abrir menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <strong class="mobile-brand">TibiaApp</strong>
    </header>
  `,
  styles: [`
    .mobile-brand { font-size: 1rem; font-weight: 700; letter-spacing: -0.02em; }
  `]
})
export class MobileHeaderComponent {
  protected readonly state = inject(SidebarState);
}
