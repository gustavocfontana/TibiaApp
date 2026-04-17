import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { KillStatisticsResponse } from './world-activity.models';

@Injectable({ providedIn: 'root' })
export class WorldActivityService {
  private readonly api = inject(ApiService);

  getByWorld(world: string): Observable<KillStatisticsResponse> {
    return this.api.get<KillStatisticsResponse>(`/killstatistics/${encodeURIComponent(world)}`);
  }
}
