import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { take, tap } from 'rxjs/operators';
@Component({
  selector: 'app-public-views',
  templateUrl: './public-views.component.html',
  styleUrls: ['./public-views.component.scss']
})
export class PublicViewsComponent implements OnInit {
  public isAuthChecked: boolean = null;

  constructor(private authService: AuthService, private router: Router) {}

  public ngOnInit(): void {
    this.authService.isAuthenticated$.pipe(take(1)).subscribe({
      next: (isLoggedIn: boolean) => {
        this.isAuthChecked = isLoggedIn;

        if (isLoggedIn) {
          this.router.navigate(['/views', 'editor']);
        }
      }
    });
  }

  public login() {
    this.authService.loginWithRedirect();
  }

  public get isLoggedIn$() {
    return this.authService.isAuthenticated$.pipe();
  }
}
