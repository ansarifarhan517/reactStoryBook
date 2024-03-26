// import ShipperForm from './ShipperFormView'

import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const ShipperForm = React.lazy(() => import(/* webpackChunkName: "ShipperETAProfile" */ './ShipperETAProfile'));

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
angular.module('customermaster').value('ShipperETAProfile', ShipperFormLazy);

angular.module('customermaster').controller('shipperETAProfileCtrl', function () {
})