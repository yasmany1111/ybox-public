import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { debugError } from 'src/app/core/utils';
import { environment } from 'src/environments/environment';
import { ILayeredStorageAdapter } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RemoteStorageAdapterService implements ILayeredStorageAdapter {
  public apiGetValueEndpoint = `${environment.apiUrl}/key`;

  constructor(private http: HttpClient) {}

  public getKey<T>(keyName: string): Observable<T> {
    return this.http
      .get<{ content: T }>(`${this.apiGetValueEndpoint}/${keyName}`)
      .pipe(map((c) => c.content));
  }

  public putKey(keyName: string, value: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiGetValueEndpoint}/${keyName}`, { content: value });
  }
}
