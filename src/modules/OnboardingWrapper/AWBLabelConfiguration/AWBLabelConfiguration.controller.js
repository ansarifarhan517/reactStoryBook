import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'


const AWBLabelConfiguration = React.lazy(() => import('./AWBLabelConfiguration'));
function AWBLabelConfigurationLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <AWBLabelConfiguration {...props} />
      </Suspense>

    </div>
  )
}

angular.module('onboarding').value('AWBLabelConfiguration', AWBLabelConfigurationLazy);

angular.module('onboarding').controller('awbLabelConfigurationCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'Settings';

  $scope.$on("NavigateTolist", function (evt, propData) {
    if (propData?.stepName === 'AWB_LABEL_CONFIGURATION') {
      $scope.props = propData;
    }
  });

})