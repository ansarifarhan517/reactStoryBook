import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const BonusesEntry = React.lazy(() => import(/* webpackChunkName: "BonusesListEntry" */'./BonusesListEntry'));

function BonusesEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center />
        </Position>}>
        <BonusesEntry {...props} />
      </Suspense>
    </div>
  );
}



angular.module('payments').value('bonuses', BonusesEntryLazy);


angular.module('payments').controller('bonusesCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'payments';
  $rootScope.currentPageName = 'bonusModule'
  $scope.props = {
    ngStateRouter: $state
  }
});

