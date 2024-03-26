import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const AddBonusFormEntry = React.lazy(() => import(/* webpackChunkName: "AddBonusFormEntry" */'./BonusesForm'));

function AddBonusFormEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <AddBonusFormEntry {...props}/>
      </Suspense>
    </div>
  );
}



angular.module('payments').value('bonusForm', AddBonusFormEntryLazy);


angular.module('payments').controller('bonusFormCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'payments'
  $rootScope.currentPageName = 'bonusModule'
});

