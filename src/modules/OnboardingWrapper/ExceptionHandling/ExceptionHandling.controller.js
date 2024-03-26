import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const ExceptionHandling = React.lazy(() => import('./ExceptionHandling'));

function ExceptionHandlingLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <ExceptionHandling {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('onboarding').value('ExceptionHandling', ExceptionHandlingLazy);

angular.module('onboarding').controller('ExceptionHandlingCtrl', function ($scope, $rootScope) {
    $rootScope.menuActive = 'All Exceptions';
    $scope.props = {
      currentStep: $scope.currentStep.stepName
    }
})