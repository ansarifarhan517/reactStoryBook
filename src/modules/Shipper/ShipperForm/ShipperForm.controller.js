import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const ShipperForm = React.lazy(() => import(/* webpackChunkName: "ShipperForm" */ './ShipperFormView'));

function ShipperFormLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <ShipperForm  {...props} />
      </Suspense>
    </div>
  );
}
angular.module('customermaster').value('ShipperForm', ShipperFormLazy);

angular.module('customermaster').controller('shipperFormCtrl', function ($rootScope, $scope) {
  $rootScope.menuActive = 'Customer Master';
  $scope.props={
     reloadSidebar: function(){
      $rootScope.$broadcast('RELOAD_SIDEBAR',{})
  }
  }
})