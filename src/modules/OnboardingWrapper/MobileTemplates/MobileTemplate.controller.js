import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const MobileTemplate = React.lazy(() => import('./MobileTemplate'));

function MobileRolesLazy() {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
              <MobileTemplate />
        </Suspense>
      </div>
    );
   }

angular.module('onboarding').value('MobileTemplate', MobileRolesLazy);

angular.module('onboarding').controller('MobileTemplateCtrl', function ($rootScope) {
    $rootScope.menuActive = 'Settings';
})
