//-- copyright
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
//++

import {wpDirectivesModule} from '../../../angular-modules';
import {scopedObservable} from '../../../helpers/angular-rx-utils';
import {BehaviorSubject} from 'rxjs';
import {Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {componentDestroyed} from 'ng2-rx-componentdestroyed';
import {downgradeComponent} from '@angular/upgrade/static';

// with courtesy of http://stackoverflow.com/a/29722694/3206935

@Directive({
  selector: '[focus-within]'
})
export class FocusWithinDirective implements OnInit, OnDestroy {
  @Input('focusWithinSelector') selector:string;

  private $element:ng.IAugmentedJQuery;

  constructor(private elementRef:ElementRef) {

  }

  ngOnInit() {
    this.$element = jQuery(this.elementRef.nativeElement);
    let focusedObservable = new BehaviorSubject(false);

    focusedObservable
      .auditTime(50)
      .takeUntil(componentDestroyed(this))
      .subscribe(focused => {
        this.$element.toggleClass('-focus', focused);
      });


    let focusListener = function () {
      focusedObservable.next(true);
    };
    this.$element[0].addEventListener('focus', focusListener, true);

    let blurListener = function () {
      focusedObservable.next(false);
    };
    this.$element[0].addEventListener('blur', blurListener, true);

    setTimeout(() => {
      this.$element.addClass('focus-within--trigger');
      this.$element.find(this.selector).addClass('focus-within--depending');
    }, 0);
  }

  ngOnDestroy() {
    // NOthing to do
  }
}
