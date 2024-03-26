import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const CustomForms = React.lazy(() => import(/* webpackChunkName: "settings.AlertProfilesMaster" */ './CustomForms'));


function CustomFormsLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <CustomForms {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('onboarding').value('CustomForms', CustomFormsLazy);

angular.module('onboarding').controller('CustomFormsCtrl', function ($rootScope) {
    $rootScope.menuActive = 'Settings';
})