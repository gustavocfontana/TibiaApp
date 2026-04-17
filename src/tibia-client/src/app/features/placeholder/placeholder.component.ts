import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <section class="page-header">
      <div class="page-header-top">
        <div class="page-title"><h2>{{ title }}</h2><span class="badge">soon</span></div>
      </div>
    </section>
    <section class="content-area">
      <div class="no-results">
        <p>Esta pagina sera migrada em breve.</p>
      </div>
    </section>
  `
})
export class PlaceholderComponent {
  @Input() title = 'Page';
}
