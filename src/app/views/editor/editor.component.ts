import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, take, takeUntil } from 'rxjs/operators';
import { LayerSaveStatus } from 'src/app/core/layered-storage/core/enums';
import { ILayerSaveState } from 'src/app/core/layered-storage/core/interfaces';
import { MilkdownEditorComponent } from 'src/app/milkdown/milkdown-editor/milkdown-editor.component';
import { IPage, IPageMap } from '../core/interfaces';
import { AlertSystemService } from '../core/services/alert-system.service';
import { ContentStorageService } from '../core/services/content-storage.service';
import { cleanAndValidateMarkdown } from './core/utils';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MilkdownEditorComponent)
  public editorReference: MilkdownEditorComponent;

  public renderedPage: IPage = null;
  public userPages: IPageMap[] = [];

  public isControlKeyDown = false;
  public isSavingCurrentPage = false;

  private shouldSkipNextUpdate = false;
  private triggerLocalSave$ = new Subject<{ id: string; content: string }>();
  private destroy$ = new Subject();

  constructor(
    private contentStorageService: ContentStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private alertSystemService: AlertSystemService
  ) {}

  public ngOnInit(): void {
    this.triggerLayerSaveSub();
    this.savingStatusSub();
  }

  public ngAfterViewInit(): void {
    this.routeSub();
  }

  public newPage(): void {
    this.contentStorageService.createNewPage(prompt());
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public contentChanged(newContent: string): void {
    if (this.shouldSkipNextUpdate) {
      this.shouldSkipNextUpdate = false;

      return;
    }

    if (typeof newContent !== 'string') {
      return;
    }

    this.triggerLocalSave$.next({
      id: this.renderedPage.id,
      content: newContent
    });
  }

  // Host listeners for better interaction with markdown (move somewhere else)
  @HostListener('document:click', ['$event'])
  public clickDocument(event: MouseEvent): void {
    const target: HTMLElement = event.target as HTMLElement;

    // An a tag with link class and parent with paragraph class
    if (target.tagName?.toLowerCase() === 'a') {
      if (target.classList.contains('link')) {
        if (target.parentElement?.classList.contains('paragraph')) {
          event.preventDefault();
          event.stopPropagation();

          const urlToOpen = target.getAttribute('href');

          if (this.isControlKeyDown) {
            this.isControlKeyDown = false;
            window.open(urlToOpen, '_blank');
          }
        }
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEventDown(event: KeyboardEvent): void {
    if (event.key.toLowerCase() === 'meta') {
      this.isControlKeyDown = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  public handleKeyboardEventUp(event: KeyboardEvent): void {
    if (event.key.toLowerCase() === 'meta') {
      this.isControlKeyDown = false;
    }
  }

  public uploadFile() {
    this.alertSystemService
      .promptMultiline('Paste the file content here')
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.isConfirmed && res.value?.length > 2) {
            this.updateContent(res.value);

            this.triggerLocalSave$.next();
          }
        }
      });
  }

  private routeSub(): void {
    this.route.params
      .pipe(
        switchMap((params: { pageId: string }) => {
          if (!params.pageId) {
            return of(null);
          }

          // Check if the page exists in the pageMap first
          return this.contentStorageService.getPageMaps().pipe(
            switchMap((pageMap: IPageMap[]) => {
              const isPageInMap = pageMap.find((toSearchPAge) => toSearchPAge.id === params.pageId);

              if (isPageInMap) {
                // check if the store has it stored, download if not

                return this.contentStorageService.getPageById(params.pageId);
              }

              console.error('Trying to load a page that does not exist', params.pageId);
              return of(null);
            }),
            take(1)
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (page: IPage) => {
          if (this.renderedPage) {
            // Save previous?
          }
          this.triggerLocalSave$.next(null);

          if (!page) {
            this.router.navigate(['/views', 'editor']);

            return;
          }

          this.shouldSkipNextUpdate = true;
          this.renderedPage = page;
          this.updateContent(this.renderedPage?.content);
        }
      });
  }

  private updateContent(content: string): void {
    of(true)
      .pipe(delay(100), take(1))
      .subscribe({
        next: () => {
          if (!this.editorReference) {
            return;
          }

          if (content && typeof content === 'string') {
            const validatedContent: String = cleanAndValidateMarkdown(content);

            this.editorReference.setContent(validatedContent);
          } else {
            this.editorReference.setContent(content);
          }
        }
      });
  }

  private triggerLayerSaveSub(): void {
    const changeTime = 300;

    this.triggerLocalSave$.pipe(debounceTime(changeTime), takeUntil(this.destroy$)).subscribe({
      next: (lastUpdate: { id: string; content: string }) => {
        if (lastUpdate) {
          this.contentStorageService.updatePage({
            id: lastUpdate.id,
            content: lastUpdate.content
          });

          return;
        }
      }
    });
  }

  private savingStatusSub(): void {
    this.contentStorageService
      .saveStatusSub()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (savingStatus: ILayerSaveState[]) => {
          const currPage = savingStatus.find(
            (page) =>
              page.keyName === this.contentStorageService.getPageFullId(this.renderedPage.id)
          );

          if (currPage && currPage?.status !== LayerSaveStatus.Saved) {
            this.isSavingCurrentPage = true;
          } else {
            this.isSavingCurrentPage = false;
          }
        }
      });
  }
}
