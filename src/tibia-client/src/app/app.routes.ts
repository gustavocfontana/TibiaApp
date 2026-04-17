import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'soul-cores' },
  {
    path: 'soul-cores',
    loadComponent: () => import('./features/soul-cores/soul-cores.component').then(m => m.SoulCoresComponent)
  },
  {
    path: 'highscores',
    loadComponent: () => import('./features/highscores/highscores.component').then(m => m.HighscoresComponent)
  },
  {
    path: 'spells',
    loadComponent: () => import('./features/spells/spells.component').then(m => m.SpellsComponent)
  },
  {
    path: 'worlds',
    loadComponent: () => import('./features/worlds/worlds.component').then(m => m.WorldsComponent)
  },
  {
    path: 'calculator',
    loadComponent: () => import('./features/calculator/calculator.component').then(m => m.CalculatorComponent)
  },
  {
    path: 'worlds/:world',
    loadComponent: () => import('./features/world-activity/world-activity.component').then(m => m.WorldActivityComponent)
  },
  { path: '**', redirectTo: 'soul-cores' }
];
