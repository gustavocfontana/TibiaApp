import { Component, inject } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (t of toasts(); track t.id) {
        <div class="toast" [class.success]="t.kind === 'success'" [class.error]="t.kind === 'error'"
             (click)="dismiss(t.id)">
          {{ t.message }}
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  private readonly service = inject(ToastService);
  readonly toasts = this.service.toasts;

  dismiss(id: number): void { this.service.dismiss(id); }
}
