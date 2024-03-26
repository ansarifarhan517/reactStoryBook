import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const ManifestConfigurationEntry = React.lazy(() => import('./ManifestConfiguration.Entry'));

function ManifestConfigurationEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <ManifestConfigurationEntry {...props} />
      </Suspense>
    </div>
  );
}



angular.module('onboarding').value('manifestConfiguration', ManifestConfigurationEntryLazy);


angular.module('onboarding').controller('manifestConfigurationCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'settings';
  $rootScope.currentPageName = 'manifestConfiguration'
  
  $scope.props = {
    ngStateRouter: { ...$state }
  }
});
