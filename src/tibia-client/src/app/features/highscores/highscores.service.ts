import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { HighscoresResponse } from './highscores.models';

@Injectable({ providedIn: 'root' })
export class HighscoresService {
  private readonly api = inject(ApiService);

  get(world: string, category: string, vocation: string, page: number): Observable<HighscoresResponse> {
    return this.api.get<HighscoresResponse>(`/highscores/${world}/${category}/${vocation}/${page}`);
  }
}
