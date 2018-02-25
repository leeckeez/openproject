// Declare some globals
// to work around previously magical global constants
// provided by typings@global

// Active issue
// https://github.com/Microsoft/TypeScript/issues/10178

import * as TLodash from 'lodash';
import * as TAngular from 'angular';
import * as TSinon from 'sinon';
import * as TMoment from 'moment';
import {OpenProject} from 'core-app/globals/openproject';

declare global {
  const _:typeof TLodash;
  const angular:typeof TAngular;
  const sinon:typeof TSinon;
  const moment:typeof TMoment;
  const bowser:any;
}

declare global {
  interface Window {
    appBasePath:string;
    OpenProject:OpenProject;
  }
}

export {};
