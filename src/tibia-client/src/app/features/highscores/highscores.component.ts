import { Component, computed, inject, signal } from '@angular/core';
import { HighscoresService } from './highscores.service';
import { HighscoresResponse } from './highscores.models';
import { WorldsService } from '../worlds/worlds.service';

@Component({
  selector: 'app-highscores',
  standalone: true,
  templateUrl: './highscores.component.html'
})
export class HighscoresComponent {
  private readonly service = inject(HighscoresService);
  private readonly worldsService = inject(WorldsService);

  readonly categories = [
    'experience', 'magiclevel', 'swordfighting', 'axefighting', 'clubfighting',
    'distancefighting', 'shielding', 'fishing', 'fistfighting',
    'achievements', 'charmpoints', 'loyaltypoints', 'dromescore', 'goshnarstaint'
  ];
  readonly vocations = ['all', 'knights', 'paladins', 'sorcerers', 'druids', 'monks'];

  readonly world = signal('Antica');
  readonly category = signal('experience');
  readonly vocation = signal('all');
  readonly page = signal(1);

  readonly worlds = signal<string[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly data = signal<HighscoresResponse | null>(null);

  readonly entries = computed(() => this.data()?.entries ?? []);

  constructor() {
    this.loadWorlds();
    this.load();
  }

  loadWorlds(): void {
    this.worldsService.getAll().subscribe({
      next: res => this.worlds.set(res.worlds.map(w => w.name))
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.get(this.world(), this.category(), this.vocation(), this.page()).subscribe({
      next: data => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.message ?? 'Falha ao carregar highscores');
        this.loading.set(false);
      }
    });
  }

  onWorldChange(e: Event): void { this.world.set((e.target as HTMLSelectElement).value); this.page.set(1); this.load(); }
  onCategoryChange(e: Event): void { this.category.set((e.target as HTMLSelectElement).value); this.page.set(1); this.load(); }
  onVocationChange(e: Event): void { this.vocation.set((e.target as HTMLSelectElement).value); this.page.set(1); this.load(); }

  prevPage(): void {
    if (this.page() > 1) { this.page.update(p => p - 1); this.load(); }
  }

  nextPage(): void {
    this.page.update(p => p + 1);
    this.load();
  }

  rankClass(rank: number): string {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return '';
  }

  vocationSlug(voc: string): string {
    const v = voc.toLowerCase();
    if (v.includes('knight')) return 'ek';
    if (v.includes('paladin')) return 'rp';
    if (v.includes('sorcerer')) return 'ms';
    if (v.includes('druid')) return 'ed';
    return 'none';
  }

  vocationShort(voc: string): string {
    const v = voc.toLowerCase();
    if (v.includes('elite knight')) return 'EK';
    if (v.includes('knight')) return 'K';
    if (v.includes('royal paladin')) return 'RP';
    if (v.includes('paladin')) return 'P';
    if (v.includes('master sorcerer')) return 'MS';
    if (v.includes('sorcerer')) return 'S';
    if (v.includes('elder druid')) return 'ED';
    if (v.includes('druid')) return 'D';
    if (v.includes('monk')) return 'M';
    return voc || '—';
  }
}
