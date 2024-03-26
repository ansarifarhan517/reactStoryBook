import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const OrganizationRoleEntry = React.lazy(() => import('./OrganizationRoleEntry'));

function OrganizationRoleEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <OrganizationRoleEntry {...props} />
      </Suspense>
    </div>
  );
}

angular.module('onboarding').value('OrganizationRoleEntry', OrganizationRoleEntryLazy);

angular.module('onboarding').controller('organizationRoleListViewCtrl', function ($rootScope) {
  $rootScope.menuActive = 'settings';
  $rootScope.currentPageName = 'addOrganizationForm';
})