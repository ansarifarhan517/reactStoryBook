// import RateProfileForm from './RateProfileForm'
import React, {Suspense} from 'react'
import {Position, Loader} from 'ui-library'

const RateProfile = React.lazy(() => import('../RateProfileForm/RateProfileForm'));

function RateProfileLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center />
        </Position>}>
        <RateProfile />
      </Suspense>
    </div>
  );
}

angular.module('customermaster').value('RateProfileForm', RateProfileLazy);

angular.module('customermaster').controller('rateProfileFormCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'payments';
  $scope.props = {
    ngStateRouter: { ...$state }
  }

})
