import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fluid-login',
  templateUrl: './fluid-login.component.html',
  styleUrls: ['./fluid-login.component.scss']
})
export class FluidLoginComponent implements OnInit {
  @Output()
  public closeOverlayRequest = new EventEmitter<void>();

  @Output()
  public loginSubmit = new EventEmitter<{
    email: string;
    password: string;
  }>();

  @Output()
  public registerSubmit = new EventEmitter<{
    email: string;
    password: string;
    confirmPassword: string;
  }>();

  @Input()
  public errors: string[] = [];
  @Input()
  public canBeClosed: boolean = true;
  @Input()
  public isInProcessingState: boolean = false;
  @Input()
  public registerError: string = null;

  @Input()
  public isAbleToRegister: boolean = false;

  public isBackgroundVisible = false;

  public loginForm: FormGroup;
  public registerForm: FormGroup;

  public isInLoginMode = true;

  constructor() {}

  public ngOnInit(): void {
    setTimeout(() => (this.isBackgroundVisible = true), 20);
    this.initForms();

    new Date();
  }

  public submitLoginForm(): void {
    this.errors = [];
    this.loginSubmit.emit({
      email: this.emailControl.value,
      password: this.passwordControl.value
    });
  }

  public submitRegisterForm(): void {
    this.errors = [];
    this.registerSubmit.emit({
      email: this.emailRegisterControl.value,
      password: this.passwordRegisterControl.value,
      confirmPassword: this.confirmPasswordRegisterControl.value
    });
  }

  public clickedOverlay(event: MouseEvent): void {
    const target: HTMLDivElement = event.target as any;
    if (target.classList.contains('box-container')) {
      this.closeOverlayRequest.emit();
    }
  }

  public closeEmit(): void {
    this.closeOverlayRequest.emit();
  }

  // Controls for login
  public get emailControl(): AbstractControl {
    return this.loginForm.get('email');
  }

  public get passwordControl(): AbstractControl {
    return this.loginForm.get('password');
  }

  // Controls for register
  public get emailRegisterControl(): AbstractControl {
    return this.registerForm.get('email');
  }

  public get passwordRegisterControl(): AbstractControl {
    return this.registerForm.get('password');
  }

  public get confirmPasswordRegisterControl(): AbstractControl {
    return this.registerForm.get('confirmPassword');
  }

  public get arePasswordsDifferent() {
    return (
      this.registerForm.get('confirmPassword').value !== this.registerForm.get('password').value
    );
  }

  private initForms(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(7)])
    });

    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(7)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(7)])
    });
  }
}
