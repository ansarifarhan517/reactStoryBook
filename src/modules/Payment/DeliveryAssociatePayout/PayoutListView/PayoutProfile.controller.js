import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library';

const PayoutListView = React.lazy(() => import(/* webpackChunkName: "Payout List view" */ './PayoutListView'));

function PayoutProfileEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <PayoutListView {...props} />
      </Suspense>
    </div>
  );
}
angular.module('payments').value('PayoutListView', PayoutProfileEntryLazy);

angular.module('payments').controller('payoutProfileCtrl', function ($rootScope, $scope, $state) {
  $rootScope.menuActive = 'payments',
  $rootScope.currentPageName = 'payoutModule'
  $scope.props = {
    ngStateRouter: $state
  }
})

