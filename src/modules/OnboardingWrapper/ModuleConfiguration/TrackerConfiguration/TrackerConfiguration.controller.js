import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const TrackerConfiguration = React.lazy(() => import('./TrackerConfiguration'));

function TrackerConfigurationLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <TrackerConfiguration {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('onboarding').value('TrackerConfiguration', TrackerConfigurationLazy);

angular.module('onboarding').controller('TrackerConfigurationCtrl', function ($scope, $rootScope) {

  $rootScope.menuActive = 'Settings';
  $scope.$on("NavigateTolist", function (evt, propData) {
    if (propData?.stepName === 'TRACKER_CONFIGURATION') {
      $scope.props = propData;
    }
  });
})