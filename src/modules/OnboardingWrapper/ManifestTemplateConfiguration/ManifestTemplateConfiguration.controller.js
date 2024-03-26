import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'


const ManifestTemplateConfiguration = React.lazy(() => import('./ManifestTemplateConfiguration'));
function ManifestTemplateConfigurationLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <ManifestTemplateConfiguration {...props} />
      </Suspense>

    </div>
  )
}

angular.module('onboarding').value('manifestTemplateConfiguration', ManifestTemplateConfigurationLazy);

angular.module('onboarding').controller('manifestTemplateConfigurationCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'Settings';

  $scope.$on("NavigateTolist", function (evt, propData) {
    if (propData?.stepName === 'MANIFEST_TEMPLATE_CONFIGURATION') {
      $scope.props = propData;
    }
  });

})