// import DeliveryAssociate from './DeliveryAssociate'


import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const DeliveryAssociate = React.lazy(() => import('./DeliveryAssociate'));

function DriverListViewLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <DeliveryAssociate {...props} />
      </Suspense>
    </div>
  );
}

angular.module('deliveryMedium').value('DeliveryAssociateListView', DriverListViewLazy);

angular.module('deliveryMedium').controller('deliveryAssociateListViewCtrl', 
  function($rootScope, $scope, $state) {
    $rootScope.menuActive = 'deliveryMedium';
    $scope.props = {
      ngStateRouter: $state,
    }
  }
)