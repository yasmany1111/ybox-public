import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LayerSaveStatus } from 'src/app/core/layered-storage/core/enums';
import { ILayerSaveState } from 'src/app/core/layered-storage/core/interfaces';
import { IPageMap } from '../../core/interfaces';
import { AlertSystemService } from '../../core/services/alert-system.service';
import { ContentStorageService } from '../../core/services/content-storage.service';

interface IPageMapModified extends IPageMap {
  children?: IPageMapModified[];
}

@Component({
  selector: 'app-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss']
})
export class PageSelectorComponent implements OnInit, OnDestroy {
  public pages: IPageMapModified[] = [];

  @Output()
  public pageRemoved = new EventEmitter<string>();

  @Output()
  public manualFileUpload = new EventEmitter<string>();

  public saveStatuses: ILayerSaveState[] = [];

  private destroy$ = new Subject();

  constructor(
    private store: Store,
    private contentStorageService: ContentStorageService,
    private alertSystemService: AlertSystemService
  ) {}

  public ngOnInit(): void {
    this.pagesStateSub();
    this.saveStatusSub();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getIconClass(page: IPageMap) {
    const el = this.saveStatuses.find(
      (e) => e.keyName === this.contentStorageService.getPageFullId(page.id)
    );

    switch (el?.status) {
      case LayerSaveStatus.QueuedFirstLayer:
        return {
          shimmer: true,
          'first-layer-load': true
        };

      case LayerSaveStatus.QueuedSecondLayer:
        return {
          shimmer: true,
          'second-layer-load': true
        };

      case LayerSaveStatus.Saved:
        return {
          shimmer: true,
          saved: true
        };

      default:
        return {};
    }
  }

  public updateFileInAPI(id: string) {
    // this.contentStorageService.updatePageInLocalStorage(id);
  }

  public removePageById(id: string) {
    this.contentStorageService.removePage(id);
  }

  public editPageName(id: string) {
    this.alertSystemService
      .prompt('New page name')
      .pipe(take(1))
      .subscribe({
        next: (result: {
          isConfirmed: boolean;
          isDenied: boolean;
          isDismissed: boolean;
          value: string;
        }) => {
          if (result.isConfirmed && result?.value?.length > 2)
            this.contentStorageService.editPageName(id, result.value);
        }
      });
  }

  public downloadPage(id: string) {
    this.contentStorageService.downloadPage(id);
  }

  public getPagesWithChildren(originalPages: IPageMap[]): IPageMap[] {
    const allPages: IPageMap[] = JSON.parse(JSON.stringify(originalPages));

    let newPagesWithChildren: IPageMap[] = [];

    function insertInParent(name: string, pageToInsert: IPageMap) {
      newPagesWithChildren = newPagesWithChildren.map((page: IPageMapModified) => {
        if (page.name === name) {
          const modifiedPage: IPageMapModified[] = page?.children ? page.children : [];
          pageToInsert.name = pageToInsert.name.split('/')[1];

          return {
            ...page,
            children: [...modifiedPage, pageToInsert]
          };
        }

        return page;
      });
    }

    for (const page of allPages) {
      if (page.name.includes('/')) {
        const parent = page.name.split('/')[0];
        insertInParent(parent, page);
      } else {
        // Root page
        newPagesWithChildren.push(page);
      }
    }

    return newPagesWithChildren;
  }

  private pagesStateSub() {
    this.contentStorageService
      .subToPageMaps()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pageMaps: IPageMap[]) => {
          this.pages = this.getPagesWithChildren(this.sortPageMap(pageMaps));
        }
      });
  }

  private saveStatusSub() {
    this.contentStorageService
      .saveStatusSub()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (saveStatuses: ILayerSaveState[]) => {
          this.saveStatuses = saveStatuses;
        }
      });
  }

  private sortPageMap(pageMaps: IPageMap[]): IPageMap[] {
    const dupPageMaps: IPageMap[] = JSON.parse(JSON.stringify(pageMaps));

    return dupPageMaps.sort((a: IPageMap, b: IPageMap) => {
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }

      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }

      return 0;
    });
  }
}
