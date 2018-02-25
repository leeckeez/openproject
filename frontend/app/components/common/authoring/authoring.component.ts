//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
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
// See docs/COPYRIGHT.rdoc for more details.
//++

import {Component, Inject, Input, OnInit} from '@angular/core';
import {I18nToken, TimezoneServiceToken} from '../../../angular4-transition-utils';
import {PathHelperService} from 'core-components/common/path-helper/path-helper.service';
import {HalResource} from 'core-components/api/api-v3/hal-resources/hal-resource.service';
import {opUiComponentsModule} from 'core-app/angular-modules';
import {downgradeComponent} from '@angular/upgrade/static';

@Component({
  template: require('!!raw-loader!./authoring.html'),
  selector: 'authoring',
})
export class AuthoringComponent implements OnInit {
  // scope: { createdOn: '=', author: '=', showAuthorAsLink: '=', project: '=', activity: '=' },
  @Input('createdOn') createdOn:string;
  @Input('author') author:HalResource;
  @Input('showAuthorAsLink') showAuthorAsLink:boolean;
  @Input('project') project:any;
  @Input('activity') activity:any;

  public createdOnTime:any;
  public timeago:any;
  public time:any;
  public userLink:string;

  public constructor(readonly PathHelper:PathHelperService,
                     @Inject(I18nToken) readonly I18n:op.I18n,
                     @Inject(TimezoneServiceToken) readonly TimezoneService:any) {

  }

  ngOnInit() {
    this.createdOnTime = this.TimezoneService.parseDatetime(this.createdOn);
    this.timeago = this.createdOnTime.fromNow();
    this.time = this.createdOnTime.format('LLL');
    this.userLink = this.PathHelper.userPath(this.author.id);
  }

  public activityFromPath(from:any) {
    var path = this.PathHelper.projectActivityPath(this.project);

    if (from) {
      path += '?from=' + from;
    }

    return path;
  }
}

opUiComponentsModule.directive('authoring',
  downgradeComponent({component: AuthoringComponent})
);
