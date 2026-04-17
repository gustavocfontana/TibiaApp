import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  readonly trackers: NavLink[] = [
    { label: 'Soul Cores', path: '/soul-cores', icon: 'shield' }
  ];

  readonly explore: NavLink[] = [
    { label: 'Highscores', path: '/highscores', icon: 'trophy' },
    { label: 'Spells', path: '/spells', icon: 'sparkles' },
    { label: 'Worlds', path: '/worlds', icon: 'globe' }
  ];
}
