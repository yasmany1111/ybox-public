import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { IdToken } from '@auth0/auth0-spa-js';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ILayerSaveState } from 'src/app/core/layered-storage/core/interfaces';
import { LayeredStorageService } from 'src/app/core/layered-storage/layered-storage.service';
import { debugLog, downloadFile } from 'src/app/core/utils';
import { IPage, IPageMap } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContentStorageService {
  private pageMapKeyName: string = 'page-maps';
  private userId = '';

  constructor(
    private layeredStorageService: LayeredStorageService,
    private store: Store,
    private auth: AuthService
  ) {
    this.auth.idTokenClaims$.subscribe((idToken: IdToken) => {
      this.userId = idToken?.sub;
    });
  }

  public getPageMaps(): Observable<IPageMap[]> {
    return this.subToPageMaps().pipe(take(1));
  }

  public subToPageMaps(): Observable<IPageMap[]> {
    return this.layeredStorageService.subToKey<IPageMap[]>(this.getPageMapKeyName()).pipe(
      map((pageMaps: IPageMap[]) => {
        if (!pageMaps?.length) {
          debugLog('No page map found in any layer, assume []');

          return [];
        }

        return pageMaps;
      })
    );
  }

  public getPageById(id: string): Observable<IPage> {
    return this.layeredStorageService.getKey(this.getPageFullId(id));
  }

  public createNewPage(pageName: string): void {
    const newKeyName = (new Date().getTime() * Math.random() + Math.random().toString()).toString();
    const newPage: IPage = {
      content: '',
      id: newKeyName
    };

    this.layeredStorageService.putKey(this.getPageFullId(newKeyName), newPage).subscribe();
    // we need to upd the page map too
    this.layeredStorageService
      .getKey<IPageMap[]>(this.getPageMapKeyName())
      .pipe(take(1))
      .subscribe({
        next: (pageMaps: IPageMap[]) => {
          if (!pageMaps?.length) {
            pageMaps = [];
          }

          const newPageMap: IPageMap = {
            id: newKeyName,
            name: pageName,
            isModified: false
          };

          const newPageMaps = [...pageMaps, newPageMap];

          this.layeredStorageService.putKey(this.getPageMapKeyName(), newPageMaps).subscribe();
        }
      });
  }

  public updatePage(page: IPage): void {
    this.layeredStorageService.putKey(this.getPageFullId(page.id), page).subscribe();
  }

  public removePage(id: string): void {
    this.layeredStorageService
      .getKey<IPageMap[]>(this.getPageMapKeyName())
      .pipe(take(1))
      .subscribe({
        next: (pageMaps: IPageMap[]) => {
          if (!pageMaps?.length) {
            pageMaps = [];
          }

          pageMaps = pageMaps.filter((pm) => pm.id !== id);

          this.layeredStorageService.putKey(this.getPageMapKeyName(), pageMaps);
        }
      });
  }

  public saveStatusSub(): Observable<ILayerSaveState[]> {
    return this.layeredStorageService.saveStatusSub();
  }

  public editPageName(id: string, name: string) {
    this.getPageMaps()
      .pipe(take(1))
      .subscribe({
        next: (pageMaps: IPageMap[]) => {
          const newPageMaps = pageMaps.map((pageMap: IPageMap) => {
            if (pageMap.id === id) {
              return {
                ...pageMap,
                name: name
              };
            }

            return pageMap;
          });

          this.layeredStorageService.putKey(this.getPageMapKeyName(), newPageMaps).subscribe();
        }
      });
  }

  public downloadPage(id: string) {
    this.getPageMaps()
      .pipe(take(1))
      .subscribe({
        next: (pageMaps: IPageMap[]) => {
          const pageMap = pageMaps.find((pageMap: IPageMap) => {
            if (pageMap.id === id) {
              return true;
            }

            return false;
          });

          if (pageMap) {
            this.getPageById(id)
              .pipe(take(1))
              .subscribe({
                next: (page: IPage) => {
                  downloadFile(pageMap.name, page.content);
                }
              });
          }
        }
      });
  }

  // ID
  public getPageMapKeyName() {
    return `${this.userId}-${this.pageMapKeyName}`;
  }

  public getPageFullId(partialId: string) {
    return `${this.userId}-${partialId}`;
  }
}
