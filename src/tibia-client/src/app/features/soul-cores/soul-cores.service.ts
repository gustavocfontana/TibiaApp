import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { ImportResponse, SoulCoresResponse, ToggleResponse } from './soul-cores.models';

@Injectable({ providedIn: 'root' })
export class SoulCoresService {
  private readonly api = inject(ApiService);

  getAll(): Observable<SoulCoresResponse> {
    return this.api.get<SoulCoresResponse>('/soulcores');
  }

  toggle(race: string): Observable<ToggleResponse> {
    return this.api.put<ToggleResponse>(`/soulcores/${encodeURIComponent(race)}`);
  }

  import(owned: string[]): Observable<ImportResponse> {
    return this.api.post<ImportResponse>('/soulcores/import', { owned });
  }

  reset(): Observable<ImportResponse> {
    return this.api.delete<ImportResponse>('/soulcores');
  }
}
