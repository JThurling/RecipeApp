import {Directive, ViewContainerRef} from '@angular/core';
import {Container} from '@angular/compiler/src/i18n/i18n_ast';

@Directive({
  selector: '[appPlaceHolder]'
})
export class PlaceholderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
