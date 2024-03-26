import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'


const AWBLabelConfiguration = React.lazy(() => import('./ManifestLabelConfiguration'));
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

angular.module('onboarding').value('manifestLabelConfiguration', AWBLabelConfigurationLazy);

angular.module('onboarding').controller('manifestLabelConfigurationCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'Settings';

  $scope.$on("NavigateTolist", function (evt, propData) {
    if (propData?.stepName === 'MANIFEST_LABEL_CONFIGURATION') {
      $scope.props = propData;
    }
  });

})