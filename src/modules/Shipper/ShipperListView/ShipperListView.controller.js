import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const ShipperListViewEntry = React.lazy(() => import('./ShipperListEntry'));

function ShipperListViewLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <ShipperListViewEntry {...props} />
      </Suspense>
    </div>
  );
}

angular.module('customermaster').value('ShipperListView', ShipperListViewLazy);

angular.module('customermaster').controller('shipperListViewCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'Customer Master';
  $scope.props = { ngStateRouter: {}}
  angular.copy($state, $scope.props.ngStateRouter)
})