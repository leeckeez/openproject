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

import {InputState, State} from 'reactivestates';
import {scopedObservable} from '../../../helpers/angular-rx-utils';
import {Observable} from 'rxjs';
import {QueryResource} from '../../api/api-v3/hal-resources/query-resource.service';
import {TableState} from 'core-components/wp-table/table-state/table-state';
import {QuerySchemaResourceInterface} from 'core-components/api/api-v3/hal-resources/query-schema-resource.service';
import {States} from 'core-components/states.service';
import {WorkPackageCollectionResource} from 'core-components/api/api-v3/hal-resources/wp-collection-resource.service';
import {takeUntil} from 'rxjs/operators';

export abstract class WorkPackageTableBaseService<T> {
  protected tableState:TableState;

  constructor(protected states:States) {
    // TODO Remove global references
    this.tableState = states.globalTable;
  }

  /**
   * Return the state this service cares for from the table state.
   * @returns {InputState<T>}
   */
  public abstract get state():InputState<T>;

  /**
   * Get the state value from the current query.
   *
   * @param {QueryResource} query
   * @returns {T} Instance of the state value for this type.
   */
  public abstract valueFromQuery(query:QueryResource, results:WorkPackageCollectionResource):T|undefined;

  /**
   * Initialize this table state from the given query resource,
   * and possibly the associated schema.
   *
   * @param {QueryResource} query
   * @param {QuerySchemaResourceInterface} schema
   */
  public initialize(query:QueryResource, results:WorkPackageCollectionResource, schema?:QuerySchemaResourceInterface) {
    this.state.putValue(this.valueFromQuery(query, results)!);
  }

  public clear(reason:string) {
    this.state.clear(reason);
  }

  public observeOnScope(scope:ng.IScope) {
    return scopedObservable(scope, this.state.values$());
  }

  public observeUntil(unsubscribe:Observable<any>) {
    return this.state.values$().pipe(takeUntil(unsubscribe));
  }

  public onReady(scope:ng.IScope) {
    return scopedObservable(scope, this.state.values$()).take(1).mapTo(null).toPromise();
  }
}

export interface WorkPackageQueryStateService {
  /**
   * Check whether the state value does not match the query resource's value.
   * @param query The current query resource
   */
  hasChanged(query:QueryResource):boolean;

  /**
   * Apply the current state value to query
   *
   * @return Whether the query should be visibly updated.
   */
  applyToQuery(query:QueryResource):boolean;

  state:State<any>;
}
