import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const AddOrderForm = React.lazy(() => import(/* webpackChunkName: "AddOrderForm" */ './AddOrderForm'));

function OrderFormLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <AddOrderForm />
      </Suspense>
    </div>
  );
}
angular.module('order').value('AddOrderForm', OrderFormLazy);

angular.module('order').controller('orderFormCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'order';
})