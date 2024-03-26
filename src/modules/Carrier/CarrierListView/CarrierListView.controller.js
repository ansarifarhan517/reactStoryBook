import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const CarrierListView = React.lazy(() => import('./CarrierListView'));

function CarrierListViewLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <CarrierListView {...props} />
      </Suspense>
    </div>
  );
}

angular.module('contract').value('CarrierListView', CarrierListViewLazy);

angular.module('contract').controller('CarrierListViewCtrl', function ($rootScope, $scope, $state) {
  $rootScope.menuActive = 'Carrier';
  $scope.props = {
    ngStateRouter: $state,
  }
})