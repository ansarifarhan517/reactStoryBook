import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const CompartmentConfiguration = React.lazy(() => import('./CompartmentConfiguration'));

function CompartmentConfigurationLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <CompartmentConfiguration {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('onboarding').value('CompartmentConfiguration', CompartmentConfigurationLazy);

angular.module('onboarding').controller('CompartmentConfigurationCtrl', function ($scope, $rootScope) {

  $rootScope.menuActive = 'Settings';
  $scope.$on("NavigateTolist", function (evt, propData) {
    if (propData?.stepName === 'COMPARTMENT_CONFIGURATION') {
      $scope.props = propData;
    }
  });
})