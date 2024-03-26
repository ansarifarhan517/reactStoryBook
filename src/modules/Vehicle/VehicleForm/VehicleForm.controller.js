// import VehicleForm from './VehicleForm'

import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const VehicleForm = React.lazy(() => import(/* webpackChunkName: "VehicleForm" */ './VehicleForm'));

function VehicleFormLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <VehicleForm />
      </Suspense>
    </div>
  );
}
angular.module('vehicle').value('VehicleForm', VehicleFormLazy);

angular.module('vehicle').controller('vehicleFormCtrl', function () {

})