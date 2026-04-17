import { Routes } from '@angular/router';
import { PlaceholderComponent } from './features/placeholder/placeholder.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'soul-cores' },
  { path: 'soul-cores', component: PlaceholderComponent, data: { title: 'Soul Cores' } },
  { path: 'highscores', component: PlaceholderComponent, data: { title: 'Highscores' } },
  { path: 'spells', component: PlaceholderComponent, data: { title: 'Spells' } },
  { path: 'worlds', component: PlaceholderComponent, data: { title: 'Worlds' } },
  { path: '**', redirectTo: 'soul-cores' }
];
