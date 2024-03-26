// import PlansForm from './PlansForm'

import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const PlansForm = React.lazy(() => import(/* webpackChunkName: "PlansForm" */ './PlansForm'));

function PlansFormLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <PlansForm />
      </Suspense>
    </div>
  );
}
angular.module('saas').value('PlansForm', PlansFormLazy);

angular.module('saas').controller('plansFormCtrl', function () {

})