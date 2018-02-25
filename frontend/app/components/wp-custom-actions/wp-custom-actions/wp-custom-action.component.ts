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

import {opUiComponentsModule} from '../../../angular-modules';

import {Component, HostListener, Inject, Input} from '@angular/core';
import {CustomActionResourceInterface} from 'core-components/api/api-v3/hal-resources/custom-action-resource.service';
import {WorkPackageResourceInterface} from 'core-components/api/api-v3/hal-resources/work-package-resource.service';
import {HalRequestService} from 'core-components/api/api-v3/hal-request/hal-request.service';
import {WorkPackageCacheService} from 'core-components/work-packages/work-package-cache.service';
import {WorkPackageNotificationService} from 'core-components/wp-edit/wp-notification.service';
import {downgradeComponent} from '@angular/upgrade/static';
import {halRequestToken} from 'core-app/angular4-transition-utils';

@Component({
  selector: 'wp-custom-action',
  template: require('!!raw-loader!./wp-custom-action.component.html')
})
export class WpCustomActionComponent {

  @Input() workPackage:WorkPackageResourceInterface;
  @Input() action:CustomActionResourceInterface;

  constructor(@Inject(halRequestToken) private halRequest:HalRequestService,
              private wpCacheService:WorkPackageCacheService,
              private wpNotificationsService:WorkPackageNotificationService) { }

  private fetchAction() {
    this.halRequest.get(this.action.href!)
      .then((action) => {
        this.action = <CustomActionResourceInterface>action;
      });
  }

  public update() {
    let payload = {
      lockVersion: this.workPackage.lockVersion,
      _links: {
        workPackage: {
          href: this.workPackage.href
        }
      }
    };

    this.halRequest.post<WorkPackageResourceInterface>(this.action.href + '/execute', payload)
      .then((savedWp:WorkPackageResourceInterface) => {
        this.wpNotificationsService.showSave(savedWp, false);
        this.workPackage = savedWp;
        this.wpCacheService.updateWorkPackage(savedWp);
      }).catch((errorResource:any) => {
        this.wpNotificationsService.handleErrorResponse(errorResource, this.workPackage);
      });
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.fetchAction();
  }
}

opUiComponentsModule.directive(
  'wpCustomAction',
  downgradeComponent({component: WpCustomActionComponent})
);
