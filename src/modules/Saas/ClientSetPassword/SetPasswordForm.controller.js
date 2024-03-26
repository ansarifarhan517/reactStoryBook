import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const SetPasswordForm = React.lazy(() => import('./SetPasswordForm'));

function SetPasswordFormLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}



angular.module('saas').value('SetPasswordForm', SetPasswordFormLazy);

angular.module('saas').controller('setPasswordFormCtrl', function ($scope, $rootScope) {
  $scope.currentPage = "setPassword";
 
});