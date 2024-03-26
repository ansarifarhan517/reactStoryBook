import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const UserManagementEntry = React.lazy(() => import('./UserManagementEntry'));

function UserManagementEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <UserManagementEntry {...props} />
      </Suspense>
    </div>
  );
}

angular.module('onboarding').value('UserManagementEntry', UserManagementEntryLazy);

angular.module('onboarding').controller('userManagementListViewCtrlReact', function ($rootScope) {
  $rootScope.menuActive = 'settings';
  $rootScope.currentPageName = 'addUserForm'
})