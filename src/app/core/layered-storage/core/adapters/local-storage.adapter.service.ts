import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { debugError } from 'src/app/core/utils';
import { environment } from 'src/environments/environment';
import { ILayeredStorageAdapter } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageAdapterService implements ILayeredStorageAdapter {
  private localStoragePrefix = '__layered-storage_';

  public getKey<T>(keyName: string): Observable<T> {
    let storedKeyValue: T = null;

    try {
      const storageContent: string = localStorage.getItem(`${this.localStoragePrefix}${keyName}`);

      storedKeyValue = JSON.parse(storageContent);
    } catch (error) {}

    return of(storedKeyValue);
  }

  public putKey(keyName: string, value: any): Observable<boolean> {
    localStorage.setItem(`${this.localStoragePrefix}${keyName}`, JSON.stringify(value));

    return of(true);
  }
}
