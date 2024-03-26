import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const RaisedExceptionHandling = React.lazy(() => import('../OnboardingWrapper/ExceptionHandling/ExceptionHandling'));

function RaisedExceptionHandlingLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <RaisedExceptionHandling {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('order').value('RaisedExceptionHandling', RaisedExceptionHandlingLazy);

angular.module('order').controller('RaisedExceptionHandlingCtrl', function ($scope, $rootScope) {

    $scope.props = {
      currentStep: 'RAISED_EXCEPTIONS'
    }
})