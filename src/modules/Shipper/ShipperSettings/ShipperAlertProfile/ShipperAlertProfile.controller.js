import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const ShipperForm = React.lazy(() => import(/* webpackChunkName: "ShipperAlertProfile" */ './ShipperAlertProfile'));

function ShipperFormLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <ShipperForm />
      </Suspense>
    </div>
  );
}
angular.module('customermaster').value('ShipperAlertProfile', ShipperFormLazy);

angular.module('customermaster').controller('shipperAlertProfileCtrl', function () {
})