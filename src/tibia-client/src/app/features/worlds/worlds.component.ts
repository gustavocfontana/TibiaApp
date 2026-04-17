import { Component, computed, inject, signal } from '@angular/core';
import { WorldsService } from './worlds.service';
import { WorldsResponse } from './worlds.models';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../../core/ui/loading.component';
import { ErrorStateComponent } from '../../core/ui/error-state.component';

type PvpFilter = 'all' | 'open' | 'optional' | 'hardcore' | 'retro-open' | 'retro-hardcore';

@Component({
  selector: 'app-worlds',
  standalone: true,
  imports: [RouterLink, LoadingComponent, ErrorStateComponent],
  templateUrl: './worlds.component.html'
})
export class WorldsComponent {
  private readonly service = inject(WorldsService);

  readonly pvpOptions: PvpFilter[] = ['all', 'open', 'optional', 'hardcore'];

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly data = signal<WorldsResponse | null>(null);

  readonly search = signal('');
  readonly pvp = signal<PvpFilter>('all');
  readonly region = signal<string>('all');

  readonly regions = computed(() => {
    const worlds = this.data()?.worlds ?? [];
    return Array.from(new Set(worlds.map(w => w.location))).sort();
  });

  readonly filtered = computed(() => {
    const worlds = this.data()?.worlds ?? [];
    const term = this.search().trim().toLowerCase();
    const pvp = this.pvp();
    const region = this.region();
    return worlds.filter(w => {
      if (term && !w.name.toLowerCase().includes(term)) return false;
      if (pvp !== 'all' && this.pvpSlug(w.pvpType) !== pvp) return false;
      if (region !== 'all' && w.location !== region) return false;
      return true;
    });
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAll().subscribe({
      next: data => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.message ?? 'Falha ao carregar worlds');
        this.loading.set(false);
      }
    });
  }

  pvpSlug(pvp: string): string {
    return pvp.toLowerCase().replace(/\s+/g, '-');
  }

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  onRegionChange(event: Event): void {
    this.region.set((event.target as HTMLSelectElement).value);
  }
}
