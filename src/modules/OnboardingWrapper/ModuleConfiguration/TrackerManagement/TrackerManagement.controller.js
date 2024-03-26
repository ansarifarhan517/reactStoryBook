import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const TrackerManagement = React.lazy(() => import('./TrackerManagement'));

function TrackerManagementLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <TrackerManagement {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('onboarding').value('TrackerManagement', TrackerManagementLazy);

angular.module('onboarding').controller('TrackerManagementCtrl', function ($scope, $rootScope) {

  $rootScope.menuActive = 'Settings';
  $scope.props = {
    currentStep: $scope.currentStep
  }
  $scope.$on("NavigateTolist", function (evt, propData,) {
    if (propData?.stepName === 'TRACKER_CONFIGURATION') {
      $scope.props = propData;
    }
  });
})