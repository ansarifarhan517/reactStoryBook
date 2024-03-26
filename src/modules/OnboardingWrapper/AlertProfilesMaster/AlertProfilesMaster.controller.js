import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const AlertProfilesMasterEntry = React.lazy(() => import(/* webpackChunkName: "settings.AlertProfilesMaster" */ './AlertProfilesMasterEntry'));

function AlertProfilesMasterEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <AlertProfilesMasterEntry {...props} />
      </Suspense>
    </div>
  );
}
angular.module('onboarding').value('AlertProfilesMasterEntry', AlertProfilesMasterEntryLazy);

angular.module('onboarding').controller('alertProfilesMasterCtrl', function ($scope, $stateParams) {

  /** Sending this to ensure AlertProfilesMasterEntry is re-rendered when subModule query param changes */
  // console.log(, $scope.$parent.$parent.currentStep)
  $scope.props = {
    queryParams: { ...$stateParams },
    currentStep: $scope.currentStep
  }

  $scope.$watch('currentStep', function (newValue, oldValue) {
    $scope.props = {
      queryParams: { ...$stateParams },
      currentStep: $scope.currentStep
    }
  })
})

