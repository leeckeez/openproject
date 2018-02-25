// This Angular directive will act as an interface to the "upgraded" AngularJS component
// query-filters
import {
  Directive,
  DoCheck,
  ElementRef,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit
} from '@angular/core';
import {UpgradeComponent} from '@angular/upgrade/static';
import {WorkPackageResourceInterface} from 'core-components/api/api-v3/hal-resources/work-package-resource.service';

@Directive({selector: 'ng1-wp-relations-wrapper'})
export class Ng1RelationsDirectiveWrapper extends UpgradeComponent implements OnInit, OnChanges, DoCheck, OnDestroy {
  @Input('workPackage') workPackage:WorkPackageResourceInterface;

  constructor(@Inject(ElementRef) elementRef:ElementRef, @Inject(Injector) injector:Injector) {
    // We must pass the name of the directive as used by AngularJS to the super
    super('wpRelations', elementRef, injector);
  }
}

