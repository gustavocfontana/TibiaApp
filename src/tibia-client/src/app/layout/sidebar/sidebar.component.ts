import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarState } from '../sidebar.state';

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly state = inject(SidebarState);

  readonly open = this.state.open;

  readonly trackers: NavLink[] = [
    { label: 'Soul Cores', path: '/soul-cores', icon: 'shield' }
  ];

  readonly explore: NavLink[] = [
    { label: 'Highscores', path: '/highscores', icon: 'trophy' },
    { label: 'Spells', path: '/spells', icon: 'sparkles' },
    { label: 'Worlds', path: '/worlds', icon: 'globe' }
  ];

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.state.close());
  }

  closeOverlay(): void { this.state.close(); }
}
