import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const AccessProfileEntry = React.lazy(() => import('./AccessProfileEntry'));

function AccessProfileEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <AccessProfileEntry {...props} />
      </Suspense>
    </div>
  );
}

angular.module('onboarding').value('AccessProfileEntry', AccessProfileEntryLazy);

angular.module('onboarding').controller('accessProfileListViewCtrlReact', function ($rootScope,$scope) {
  $rootScope.menuActive = 'settings';
  $rootScope.currentPageName = 'accessProfile'
})

