import { Observable } from 'rxjs';

export interface ILayeredStorageAdapter {
  getKey: <T>(keyName: string) => Observable<T>;
  putKey: (keyName: string, value: any) => Observable<boolean>;
}
