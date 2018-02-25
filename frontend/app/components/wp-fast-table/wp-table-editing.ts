import {Injector} from '@angular/core';
import {WorkPackageChangeset} from 'core-components/wp-edit-form/work-package-changeset';
import {WorkPackageResourceInterface} from '../api/api-v3/hal-resources/work-package-resource.service';
import {TableRowEditContext} from '../wp-edit-form/table-row-edit-context';
import {WorkPackageEditForm} from '../wp-edit-form/work-package-edit-form';
import {WorkPackageEditingService} from '../wp-edit-form/work-package-editing-service';

export class WorkPackageTableEditingContext {

  public wpEditing:WorkPackageEditingService = this.injector.get(WorkPackageEditingService);

  constructor(private readonly injector:Injector) {
  }

  public forms:{ [wpId:string]:WorkPackageEditForm } = {};

  public reset() {
    _.each(this.forms, (form) => form.destroy());
    this.forms = {};
  }

  public changeset(workPackageId:string):WorkPackageChangeset | undefined {
    return this.wpEditing.state(workPackageId).value;
  }

  public stopEditing(workPackageId:string) {
    this.wpEditing.stopEditing(workPackageId);

    const existing = this.forms[workPackageId];
    if (existing) {
      existing.destroy();
      delete this.forms[workPackageId];
    }
  }

  public startEditing(workPackage:WorkPackageResourceInterface, classIdentifier:string):WorkPackageEditForm {
    const wpId = workPackage.id;
    const existing = this.forms[wpId];
    if (existing) {
      return existing;
    }

    // Get any existing edit state for this work package
    const editContext = new TableRowEditContext(this.injector, wpId, classIdentifier);
    return this.forms[wpId] = WorkPackageEditForm.createInContext(editContext, workPackage, false);
  }
}

