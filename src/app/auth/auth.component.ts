import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {Observable, Subscription} from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import {AlertComponent} from '../shared/alert/alert.component';
import {Placeholder} from '@angular/compiler/src/i18n/i18n_ast';
import {PlaceholderDirective} from '../shared/helper/placeholder.directive';
import {findLast} from '@angular/compiler/src/directive_resolver';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  private closedSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.showError(errorMessage);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  private showError(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainer = this.alertHost.viewContainerRef;
    hostViewContainer.clear();

    hostViewContainer.createComponent(alertCmpFactory);

    const componentRed = hostViewContainer.createComponent(alertCmpFactory);

    componentRed.instance.message = message;
    this.closedSub = componentRed.instance.close.subscribe(() => {
      this.closedSub.unsubscribe();
      hostViewContainer.clear();
    });
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {
    if (this.closedSub) {
      this.closedSub.unsubscribe();
    }
  }
}
