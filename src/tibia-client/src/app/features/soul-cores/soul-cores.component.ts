import { Component, computed, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { SoulCoresService } from './soul-cores.service';
import { SoulCoreItem, SoulCoresResponse } from './soul-cores.models';
import { ToastService } from '../../core/toast.service';
import { LoadingComponent } from '../../core/ui/loading.component';
import { ErrorStateComponent } from '../../core/ui/error-state.component';

type OwnedFilter = 'all' | 'owned' | 'missing';

const MIGRATION_KEY = 'tibiaapp.soulcores.migrated';
const LEGACY_KEY = 'tibiaSoulCores';

@Component({
  selector: 'app-soul-cores',
  standalone: true,
  imports: [LoadingComponent, ErrorStateComponent],
  templateUrl: './soul-cores.component.html'
})
export class SoulCoresComponent {
  private readonly service = inject(SoulCoresService);
  private readonly toast = inject(ToastService);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  readonly filterOptions: OwnedFilter[] = ['all', 'owned', 'missing'];

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly data = signal<SoulCoresResponse | null>(null);

  readonly search = signal('');
  readonly filter = signal<OwnedFilter>('all');

  readonly progress = computed(() => {
    const d = this.data();
    if (!d || d.total === 0) return 0;
    return Math.round((d.owned / d.total) * 100);
  });

  readonly filtered = computed(() => {
    const items = this.data()?.items ?? [];
    const term = this.search().trim().toLowerCase();
    const f = this.filter();
    return items.filter(i => {
      if (term && !i.name.toLowerCase().includes(term)) return false;
      if (f === 'owned' && !i.owned) return false;
      if (f === 'missing' && i.owned) return false;
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
        this.migrateLegacyIfNeeded();
      },
      error: err => {
        this.error.set(err?.message ?? 'Falha ao carregar soul cores');
        this.loading.set(false);
      }
    });
  }

  toggle(item: SoulCoreItem): void {
    const prev = item.owned;
    this.patchLocal(item.race, !prev);
    this.service.toggle(item.race).subscribe({
      next: res => this.patchLocal(res.creatureRace, res.owned),
      error: () => {
        this.patchLocal(item.race, prev);
        this.toast.error('Falha ao atualizar soul core');
      }
    });
  }

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  export(): void {
    const d = this.data();
    if (!d) return;
    const owned = d.items.filter(i => i.owned).map(i => i.race);
    const blob = new Blob([JSON.stringify({ owned }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soulcores-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast.success('Export gerado');
  }

  triggerImport(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    file.text().then(txt => {
      try {
        const parsed = JSON.parse(txt);
        const owned: string[] = Array.isArray(parsed.owned) ? parsed.owned : [];
        if (owned.length === 0) {
          this.toast.error('Arquivo sem soul cores');
          return;
        }
        this.service.import(owned).subscribe({
          next: res => {
            this.toast.success(`${res.imported} soul cores importados`);
            this.load();
          },
          error: () => this.toast.error('Falha ao importar')
        });
      } catch {
        this.toast.error('JSON invalido');
      } finally {
        input.value = '';
      }
    });
  }

  reset(): void {
    if (!confirm('Resetar todos os soul cores?')) return;
    this.service.reset().subscribe({
      next: () => {
        this.toast.success('Soul cores resetados');
        this.load();
      },
      error: () => this.toast.error('Falha ao resetar')
    });
  }

  private patchLocal(race: string, owned: boolean): void {
    const d = this.data();
    if (!d) return;
    const items = d.items.map(i => i.race === race ? { ...i, owned } : i);
    const ownedCount = items.filter(i => i.owned).length;
    this.data.set({ ...d, items, owned: ownedCount, missing: d.total - ownedCount });
  }

  private migrateLegacyIfNeeded(): void {
    if (localStorage.getItem(MIGRATION_KEY)) return;
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) {
      localStorage.setItem(MIGRATION_KEY, '1');
      return;
    }
    try {
      const parsed = JSON.parse(raw) as string[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(MIGRATION_KEY, '1');
        return;
      }
      this.service.import(parsed).subscribe({
        next: res => {
          localStorage.setItem(MIGRATION_KEY, '1');
          this.toast.success(`${res.imported} soul cores migrados do navegador`);
          this.load();
        }
      });
    } catch {
      localStorage.setItem(MIGRATION_KEY, '1');
    }
  }
}
