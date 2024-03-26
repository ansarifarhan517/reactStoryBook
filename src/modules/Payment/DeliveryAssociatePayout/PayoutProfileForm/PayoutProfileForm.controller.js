import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const PayoutProfileForm = React.lazy(() => import(/* webpackChunkName: "PayoutProfileForm" */ './PayoutProfileForm'));

function PayoutProfileFormLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <PayoutProfileForm {...props}/>
      </Suspense>
    </div>
  );
}
angular.module('payments').value('payoutForm', PayoutProfileFormLazy);

angular.module('payments').controller('payoutFormCtrl', function ($rootScope, $scope, $state) {
  $rootScope.menuActive = 'payments',
  $rootScope.currentPageName = 'payoutModule'
  $scope.props = {
    ngStateRouter: $state
  }
})