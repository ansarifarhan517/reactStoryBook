// import ShipperForm from './ShipperFormView'

import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const ShipperForm = React.lazy(() => import(/* webpackChunkName: "ShipperPreference" */ './ShipperPreference'));

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
angular.module('customermaster').value('ShipperPreference', ShipperFormLazy);

angular.module('customermaster').controller('shipperPreferenceCtrl', function () {
})