import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const DriverListView = React.lazy(() => import('./DriverListView'));

function DriverListViewLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <DriverListView {...props} />
      </Suspense>
    </div>
  );
}

angular.module('driver').value('DriverListView', DriverListViewLazy);

angular.module('driver').controller(
  'driverListViewCtrl',
  function($rootScope, $scope, $state) {
      $rootScope.menuActive = 'Driver';
      $scope.props = {
        ngStateRouter: $state,
      }
  }
)