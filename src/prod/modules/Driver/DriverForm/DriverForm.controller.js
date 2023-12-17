// import DriverForm from './DriverForm'

import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const DriverForm = React.lazy(() => import(/* webpackChunkName: "DriverForm" */ './DriverForm'));

function DriverFormLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <DriverForm />
      </Suspense>
    </div>
  );
}
angular.module('driver').value('DriverForm', DriverFormLazy);

angular.module('driver').controller('driverFormCtrl', function () {

})