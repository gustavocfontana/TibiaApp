import { Component, computed, signal } from '@angular/core';
import {
  VOCATIONS, SKILL_KINDS, Vocation, SkillKind,
  experienceBetween, experienceForLevel, hoursToLevel,
  hitsNeeded, manaForMagicLevel, breakdownPotions
} from './calculator.formulas';

type Tab = 'experience' | 'skills' | 'magic';

@Component({
  selector: 'app-calculator',
  standalone: true,
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  readonly tab = signal<Tab>('experience');

  readonly vocations = VOCATIONS;
  readonly skills = SKILL_KINDS;

  readonly expFrom = signal(8);
  readonly expTo = signal(100);
  readonly expPerHour = signal(500_000);

  readonly expNeeded = computed(() => experienceBetween(this.expFrom(), this.expTo()));
  readonly expAtFrom = computed(() => experienceForLevel(this.expFrom()));
  readonly expAtTo = computed(() => experienceForLevel(this.expTo()));
  readonly expHours = computed(() => hoursToLevel(this.expFrom(), this.expTo(), this.expPerHour()));

  readonly skillVocation = signal<Vocation>('knight');
  readonly skillKind = signal<SkillKind>('sword');
  readonly skillFrom = signal(10);
  readonly skillTo = signal(80);
  readonly skillLoyalty = signal(0);

  readonly skillHits = computed(() => hitsNeeded(
    this.skillVocation(), this.skillKind(),
    this.skillFrom(), this.skillTo(), this.skillLoyalty()
  ));

  readonly mlVocation = signal<Vocation>('druid');
  readonly mlFrom = signal(0);
  readonly mlTo = signal(80);
  readonly mlLoyalty = signal(0);

  readonly manaTotal = computed(() => manaForMagicLevel(
    this.mlVocation(), this.mlFrom(), this.mlTo(), this.mlLoyalty()
  ));

  readonly potions = computed(() => breakdownPotions(this.manaTotal()));

  setTab(t: Tab): void { this.tab.set(t); }

  onNumber(signalFn: (v: number) => void, event: Event, min = 0): void {
    const value = Number((event.target as HTMLInputElement).value);
    signalFn(Number.isFinite(value) && value >= min ? value : min);
  }

  onVocation(signalFn: (v: Vocation) => void, event: Event): void {
    signalFn((event.target as HTMLSelectElement).value as Vocation);
  }

  onSkillKind(event: Event): void {
    this.skillKind.set((event.target as HTMLSelectElement).value as SkillKind);
  }

  formatNumber(n: number): string {
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString('en-US');
  }

  formatHours(h: number): string {
    if (!Number.isFinite(h) || h <= 0) return '—';
    if (h < 1) return `${Math.round(h * 60)} min`;
    if (h < 24) return `${h.toFixed(1)} h`;
    const days = h / 24;
    return `${days.toFixed(1)} dias (${Math.round(h)} h)`;
  }
}
