import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const SubscriptionAndBillingMasterEntry = React.lazy(() => import(/* webpackChunkName: "SubscriptionAndBillingMasterEntry" */ './SubscriptionAndBillingMasterEntry'));

function SubscriptionAndBillingMasterEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <SubscriptionAndBillingMasterEntry {...props} />
      </Suspense>
    </div>
  );
}

angular.module('onboarding').value('SubscriptionAndBilling', SubscriptionAndBillingMasterEntryLazy); 

angular.module('onboarding').controller('billingCtrl',  
  function($rootScope, $scope, $state) {
      $rootScope.menuActive = ''; // SET_THIS
      $scope.props = {
        ngStateRouter: $state,
      }
  }
)