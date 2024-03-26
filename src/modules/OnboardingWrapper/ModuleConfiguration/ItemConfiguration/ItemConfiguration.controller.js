// import ItemConfiguration from './ItemConfiguration.tsx';

// angular.module('onboarding').value('itemConfiguration', ItemConfiguration);


import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const ItemConfigurationEntry = React.lazy(() => import('./ItemConfigurationEntry'));

function ItemConfigurationEntryLazy(props) {
  console.log('ITEM CONFIG ENTRYY')
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <ItemConfigurationEntry {...props} />
      </Suspense>
    </div>
  );
}



angular.module('onboarding').value('itemConfiguration', ItemConfigurationEntryLazy);


angular.module('onboarding').controller('itemConfigurationCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'settings';
  $rootScope.currentPageName = 'addItem'
  
  $scope.props = {
    ngStateRouter: { ...$state }
  }
});

