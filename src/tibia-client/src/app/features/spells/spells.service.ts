import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { SpellsResponse } from './spells.models';

@Injectable({ providedIn: 'root' })
export class SpellsService {
  private readonly api = inject(ApiService);

  getAll(): Observable<SpellsResponse> {
    return this.api.get<SpellsResponse>('/spells');
  }
}
