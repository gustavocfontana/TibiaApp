import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  `
})
export class LoadingComponent {
  @Input() message = 'Carregando...';
}
