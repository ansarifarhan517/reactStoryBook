import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const MobileRoles = React.lazy(() => import('./MobileRoles'));

function MobileRolesLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
              <MobileRoles {...props}/>
        </Suspense>
      </div>
    );
   }

angular.module('onboarding').value('MobileRoles', MobileRolesLazy);

angular.module('onboarding').controller('MobileRolesCtrl', function ($scope, $stateParams, $rootScope) {
    $rootScope.menuActive = 'Settings';
})
