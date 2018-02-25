// -- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
// ++

import {wpButtonsModule} from '../../../angular-modules';
import {WorkPackageTableFiltersService} from '../../wp-fast-table/state/wp-table-filters.service';
import {AbstractWorkPackageButtonComponent} from 'core-components/wp-buttons/wp-buttons.module';
import {I18nToken} from 'core-app/angular4-transition-utils';
import {Component, Inject, OnDestroy} from '@angular/core';
import {downgradeComponent} from '@angular/upgrade/static';
import WorkPackageFiltersService from 'core-components/filters/wp-filters/wp-filters.service';
import {componentDestroyed} from 'ng2-rx-componentdestroyed';

@Component({
  template: require('!!raw-loader!./wp-filter-button.html'),
  selector: 'wp-filter-button',
})
export class WorkPackageFilterButtonComponent extends AbstractWorkPackageButtonComponent implements OnDestroy  {
  public count:number;
  public initialized:boolean = false;

  public buttonId:string = 'work-packages-filter-toggle-button';
  public iconClass:string = 'icon-filter';

  constructor(@Inject(I18nToken) readonly I18n:op.I18n,
              protected wpFiltersService:WorkPackageFiltersService,
              protected wpTableFilters:WorkPackageTableFiltersService) {
    'ngInject';

    super(I18n);

    this.setupObserver();
  }

  ngOnDestroy():void {
    // Empty
  }

  public get labelKey():string {
    return 'js.button_filter';
  }

  public get textKey():string {
    return 'js.toolbar.filter';
  }

  public get label():string {
    return this.prefix + this.text.label;
  }

  public get filterCount():number {
    return this.count;
  }

  public isActive():boolean {
    return this.wpFiltersService.visible;
  }

  public performAction() {
    this.toggleVisibility();
  }

  public toggleVisibility() {
    this.wpFiltersService.toggleVisibility();
  }

  private setupObserver() {
    this.wpTableFilters
      .observeUntil(componentDestroyed(this))
      .subscribe(state => {
      this.count = state.current.length;
      this.initialized = true;
    });
  }
}

wpButtonsModule.directive(
  'wpFilterButton',
  downgradeComponent({ component: WorkPackageFilterButtonComponent })
);

