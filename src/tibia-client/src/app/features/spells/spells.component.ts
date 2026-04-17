import { Component, computed, inject, signal } from '@angular/core';
import { SpellsService } from './spells.service';
import { Spell, SpellsResponse } from './spells.models';
import { LoadingComponent } from '../../core/ui/loading.component';
import { ErrorStateComponent } from '../../core/ui/error-state.component';

type GroupFilter = 'all' | 'attack' | 'healing' | 'support';
type TypeFilter = 'all' | 'instant' | 'rune';

@Component({
  selector: 'app-spells',
  standalone: true,
  imports: [LoadingComponent, ErrorStateComponent],
  templateUrl: './spells.component.html'
})
export class SpellsComponent {
  private readonly service = inject(SpellsService);

  readonly groupOptions: GroupFilter[] = ['all', 'attack', 'healing', 'support'];
  readonly typeOptions: TypeFilter[] = ['all', 'instant', 'rune'];

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly data = signal<SpellsResponse | null>(null);

  readonly search = signal('');
  readonly group = signal<GroupFilter>('all');
  readonly type = signal<TypeFilter>('all');

  readonly filtered = computed(() => {
    const spells = this.data()?.spells ?? [];
    const term = this.search().trim().toLowerCase();
    const group = this.group();
    const type = this.type();
    return spells.filter(s => {
      if (term && !s.name.toLowerCase().includes(term) && !s.formula.toLowerCase().includes(term)) return false;
      if (group === 'attack' && !s.groupAttack) return false;
      if (group === 'healing' && !s.groupHealing) return false;
      if (group === 'support' && !s.groupSupport) return false;
      if (type === 'instant' && !s.typeInstant) return false;
      if (type === 'rune' && !s.typeRune) return false;
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
        this.error.set(err?.message ?? 'Falha ao carregar spells');
        this.loading.set(false);
      }
    });
  }

  groupOf(s: Spell): GroupFilter {
    if (s.groupAttack) return 'attack';
    if (s.groupHealing) return 'healing';
    if (s.groupSupport) return 'support';
    return 'all';
  }

  typeOf(s: Spell): TypeFilter {
    if (s.typeRune) return 'rune';
    if (s.typeInstant) return 'instant';
    return 'all';
  }

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
