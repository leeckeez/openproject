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

import {WorkPackageResourceInterface} from '../../api/api-v3/hal-resources/work-package-resource.service';
import {WorkPackageCacheService} from '../../work-packages/work-package-cache.service';
import {OnDestroy, OnInit} from '@angular/core';
import {componentDestroyed} from 'ng2-rx-componentdestroyed';
import {WorkPackagesActivityService} from 'core-components/wp-single-view-tabs/activity-panel/wp-activity.service';
import {HalResource} from 'core-components/api/api-v3/hal-resources/hal-resource.service';
import {ActivityEntryInfo} from 'core-components/wp-single-view-tabs/activity-panel/activity-entry-info';

export class ActivityPanelBaseController implements OnInit, OnDestroy {
  public workPackage:WorkPackageResourceInterface;
  public workPackageId:string;

  // All activities retrieved for the work package
  public unfilteredActivities:HalResource[] = [];

  // Visible activities
  public visibleActivities:ActivityEntryInfo[] = [];

  public reverse:boolean;
  public showToggler:boolean;

  public onlyComments:boolean = false;
  public togglerText:string;
  public text = {
    commentsOnly: this.I18n.t('js.label_activity_show_only_comments'),
    showAll: this.I18n.t('js.label_activity_show_all')
  };

  constructor(readonly wpCacheService:WorkPackageCacheService,
              readonly I18n:op.I18n,
              readonly wpActivity:WorkPackagesActivityService) {

    this.reverse = wpActivity.isReversed;
    this.togglerText = this.text.commentsOnly;
  }

  ngOnInit() {
    this.wpCacheService.loadWorkPackage(this.workPackageId)
      .values$()
      .takeUntil(componentDestroyed(this))
      .subscribe((wp:WorkPackageResourceInterface) => {
        this.workPackage = wp;
        this.wpActivity.aggregateActivities(this.workPackage).then((activities:any) => {
          this.updateActivities(activities);
        });
      });
  }

  ngOnDestroy() {
    // Nothing to do
  }

  protected updateActivities(activities:HalResource[]) {
    this.unfilteredActivities = activities;

    const visible = this.getVisibleActivities();
    this.visibleActivities = visible.map((el:HalResource, i:number) => this.info(el, i));
    this.showToggler = this.shouldShowToggler();
  }

  protected shouldShowToggler() {
    const count_all = this.unfilteredActivities.length;
    const count_with_comments = this.getActivitiesWithComments().length;

    return count_all > 1 &&
      count_with_comments > 0 &&
      count_with_comments < this.unfilteredActivities.length;
  }

  protected getVisibleActivities() {
    if (!this.onlyComments) {
      return this.unfilteredActivities;
    } else {
      return this.getActivitiesWithComments();
    }
  }

  protected getActivitiesWithComments() {
    return this.unfilteredActivities
      .filter((activity:HalResource) => !!_.get(activity, 'comment.html'));
  }

  public toggleComments() {
    this.onlyComments = !this.onlyComments;
    this.updateActivities(this.unfilteredActivities);

    if (this.onlyComments) {
      this.togglerText = this.text.showAll;
    } else {
      this.togglerText = this.text.commentsOnly;
    }
  }

  public info(activity:HalResource, index:number) {
    return this.wpActivity.info(this.unfilteredActivities, activity, index);
  }
}

