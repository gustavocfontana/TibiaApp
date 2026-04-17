import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="error-state">
      <p>{{ message }}</p>
      <button class="btn-retry" type="button" (click)="retry.emit()">Tentar novamente</button>
    </div>
  `
})
export class ErrorStateComponent {
  @Input() message = 'Algo deu errado.';
  @Output() retry = new EventEmitter<void>();
}
