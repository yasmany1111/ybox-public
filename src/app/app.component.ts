import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IPage, IPageMap } from './views/core/interfaces';
import { AlertSystemService } from './views/core/services/alert-system.service';
import { ContentStorageService } from './views/core/services/content-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isAuthChecked: boolean = null;
  public version = environment.version;

  public pages$: Observable<IPageMap[]>;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public authService: AuthService,
    private contentStorageService: ContentStorageService,
    private alertSystemService: AlertSystemService
  ) {}

  public ngOnInit() {
    this.authService.isAuthenticated$.pipe(take(1)).subscribe({
      next: (isAuth: boolean) => {
        this.isAuthChecked = isAuth;
      }
    });
  }

  public createNewPage() {
    this.alertSystemService
      .prompt('Page name')
      .pipe(take(1))
      .subscribe({
        next: (result: {
          isConfirmed: boolean;
          isDenied: boolean;
          isDismissed: boolean;
          value: string;
        }) => {
          if (result.isConfirmed && result?.value?.length > 2)
            this.contentStorageService.createNewPage(result.value);
        }
      });
  }

  public manualFileUpload(id: string) {
    // this.contentStorageService.manualUploadFile(id);
  }

  public removePage(id: string) {
    // this.contentStorageService.removePage(id);
  }

  public logout() {
    this.authService.logout();
  }

  public get isAuthenticated() {
    return this.authService.isAuthenticated$;
  }
}
