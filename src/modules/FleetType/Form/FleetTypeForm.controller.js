import React , { Suspense} from 'react'
import { Loader, Position } from 'ui-library'

const FleetTypeForm = React.lazy(()=> import('./FleetTypeForm'))

function FleetTypeFormLazy () {
return (
<div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <FleetTypeForm />
      </Suspense>
    </div>
);
}

angular.module('contract').value('FleetTypeForm', FleetTypeFormLazy);

angular.module('contract').controller('FleetTypeFormCtrl', function ($rootScope) {
  $rootScope.currentPageName = 'fleetType'
})