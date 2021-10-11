import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, switchMap, take, tap } from 'rxjs/operators';
import { LocalStorageAdapterService } from './core/adapters/local-storage.adapter.service';
import { RemoteStorageAdapterService } from './core/adapters/remote-storage.adapter.service';
import { LayerSaveStatus } from './core/enums';
import {
  ILayerContentUpdatePropagation,
  ILayeredStorageAdapter,
  ILayerSaveState
} from './core/interfaces';
import { putKey, updateSaveStatus } from './core/store/layered-storage.actions';
import { selectKey, selectLayerSaveState } from './core/store/layered-storage.selectors';

@Injectable({
  providedIn: 'root'
})
export class LayeredStorageService implements ILayeredStorageAdapter {
  private firstLayerSaveBuffers: { [key: string]: Subject<ILayerContentUpdatePropagation> } = {};
  private secondLayerSaveBuffers: { [key: string]: Subject<ILayerContentUpdatePropagation> } = {};

  constructor(
    private store: Store,
    private localStorageAdapterService: LocalStorageAdapterService,
    private remoteStorageAdapterService: RemoteStorageAdapterService
  ) {}

  public subToKey<T>(keyName: string): Observable<any> {
    return this.store.pipe(
      select(selectKey(keyName)),
      switchMap((value: T) => {
        // Already in store
        if (value) {
          return of(value);
        }

        return this.localStorageAdapterService.getKey(keyName).pipe(
          switchMap((keyValueInLocalStorage: T) => {
            if (keyValueInLocalStorage) {
              this.store.dispatch(putKey({ keyName, content: keyValueInLocalStorage }));
              return of(keyValueInLocalStorage);
            }

            return this.remoteStorageAdapterService.getKey(keyName).pipe(
              catchError((err) => {
                console.error('LS - Error reading from remote storage adapter service', err);

                return of(null);
              }),
              tap((content) => {
                if (content) {
                  this.store.dispatch(putKey({ keyName, content }));

                  return;
                }

                console.error('LS - Not found in network (or any layer)', keyName);
              })
            );
          })
        );
      })
    );
  }

  public getKey<T>(keyName: string, defaultValues = null): Observable<T> {
    return this.subToKey<T>(keyName).pipe(take(1));
  }

  public putKey(keyName: string, content: any): Observable<boolean> {
    this.zeroLayerUpdate({ keyName, updatedContent: content });

    return of(true);
  }

  public saveStatusSub(): Observable<ILayerSaveState[]> {
    return this.store.pipe(select(selectLayerSaveState));
  }

  // Layers
  private zeroLayerUpdate(update: ILayerContentUpdatePropagation): void {
    this.store.dispatch(putKey({ keyName: update.keyName, content: update.updatedContent }));

    this.firstLayerUpdate(update);
  }

  private firstLayerUpdate(update: ILayerContentUpdatePropagation): void {
    this.store.dispatch(
      updateSaveStatus({
        keyName: update.keyName,
        saveStatus: LayerSaveStatus.QueuedFirstLayer
      })
    );

    const firstLayerDebounceTime = 1000;
    let bufferedSubj: Subject<ILayerContentUpdatePropagation> =
      this.firstLayerSaveBuffers[update.keyName];

    if (!bufferedSubj) {
      bufferedSubj = new Subject<ILayerContentUpdatePropagation>();
      bufferedSubj.pipe(debounceTime(firstLayerDebounceTime)).subscribe({
        next: (updateToPropagate: ILayerContentUpdatePropagation) => {
          this.localStorageAdapterService
            .putKey(updateToPropagate.keyName, updateToPropagate.updatedContent)
            .pipe(take(1))
            .subscribe();
          // Init second layer
          this.secondLayerUpdate(updateToPropagate);
        }
      });

      this.firstLayerSaveBuffers[update.keyName] = bufferedSubj;
    }

    bufferedSubj.next(update);
  }

  private secondLayerUpdate(update: ILayerContentUpdatePropagation): void {
    this.store.dispatch(
      updateSaveStatus({
        keyName: update.keyName,
        saveStatus: LayerSaveStatus.QueuedSecondLayer
      })
    );
    const firstLayerDebounceTime = 10000;
    let bufferedSubj: Subject<ILayerContentUpdatePropagation> =
      this.secondLayerSaveBuffers[update.keyName];

    if (!bufferedSubj) {
      bufferedSubj = new Subject<ILayerContentUpdatePropagation>();
      bufferedSubj.pipe(debounceTime(firstLayerDebounceTime)).subscribe({
        next: (updateToPropagate: ILayerContentUpdatePropagation) => {
          this.remoteStorageAdapterService
            .putKey(updateToPropagate.keyName, updateToPropagate.updatedContent)
            .pipe(take(1))
            .subscribe();

          this.store.dispatch(
            updateSaveStatus({
              keyName: update.keyName,
              saveStatus: LayerSaveStatus.Saved
            })
          );
        }
      });

      this.secondLayerSaveBuffers[update.keyName] = bufferedSubj;
    }

    bufferedSubj.next(update);
  }
}
