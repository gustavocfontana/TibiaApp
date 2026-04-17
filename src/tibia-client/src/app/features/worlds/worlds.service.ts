import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { WorldsResponse } from './worlds.models';

@Injectable({ providedIn: 'root' })
export class WorldsService {
  private readonly api = inject(ApiService);

  getAll(): Observable<WorldsResponse> {
    return this.api.get<WorldsResponse>('/worlds');
  }
}
