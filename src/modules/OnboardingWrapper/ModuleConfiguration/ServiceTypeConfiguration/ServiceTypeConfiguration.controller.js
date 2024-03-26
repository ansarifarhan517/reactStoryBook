import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const ServiceTypeConfiguration = React.lazy(() => import('./ServiceTypeConfiguration'));

function ServiceTypeConfigurationLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <ServiceTypeConfiguration {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('onboarding').value('ServiceTypeConfiguration', ServiceTypeConfigurationLazy);

angular.module('onboarding').controller('ServiceTypeConfigurationCtrl', function ($scope, $rootScope) {

  $rootScope.menuActive = 'Settings';
  $scope.$on("NavigateTolist", function (evt, propData) {
    if (propData?.stepName === 'SERVICETYPE_CONFIGURATION') {
      $scope.props = propData;
    }
  });
})