import { Component, Input, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorldActivityService } from './world-activity.service';
import { KillStatisticsResponse } from './world-activity.models';
import { LoadingComponent } from '../../core/ui/loading.component';
import { ErrorStateComponent } from '../../core/ui/error-state.component';

type SortKey = 'lastDayKilled' | 'lastDayPlayersKilled' | 'lastWeekKilled' | 'race';

@Component({
  selector: 'app-world-activity',
  standalone: true,
  imports: [RouterLink, LoadingComponent, ErrorStateComponent],
  templateUrl: './world-activity.component.html'
})
export class WorldActivityComponent {
  private readonly service = inject(WorldActivityService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly data = signal<KillStatisticsResponse | null>(null);

  readonly search = signal('');
  readonly sortKey = signal<SortKey>('lastDayKilled');

  readonly filtered = computed(() => {
    const entries = this.data()?.entries ?? [];
    const term = this.search().trim().toLowerCase();
    const key = this.sortKey();
    const filtered = term
      ? entries.filter(e => e.race.toLowerCase().includes(term))
      : entries;
    return [...filtered].sort((a, b) => {
      if (key === 'race') return a.race.localeCompare(b.race);
      return (b[key] as number) - (a[key] as number);
    });
  });

  readonly totalKills = computed(() =>
    (this.data()?.entries ?? []).reduce((s, e) => s + e.lastDayKilled, 0)
  );

  readonly totalPlayersKilled = computed(() =>
    (this.data()?.entries ?? []).reduce((s, e) => s + e.lastDayPlayersKilled, 0)
  );

  private _world = '';

  @Input()
  set world(value: string) {
    this._world = value;
    if (value) this.load();
  }
  get world(): string { return this._world; }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getByWorld(this._world).subscribe({
      next: data => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.message ?? 'Falha ao carregar atividade');
        this.loading.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
