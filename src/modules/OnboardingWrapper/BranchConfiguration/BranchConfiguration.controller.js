import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const BranchConfiguration = React.lazy(() => import(/* webpackChunkName: "AddOrderForm" */ './BranchConfiguration'));

function BranchFormLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
              <BranchConfiguration {...props}/>
        </Suspense>
      </div>
    );
   }

angular.module('onboarding').value('BranchConfiguration', BranchFormLazy);

angular.module('onboarding').controller('BranchConfigurationCtrl', function ($scope, $rootScope) {

    $rootScope.menuActive = 'Settings';
    $rootScope.currentPage = 'branchConfiguration';
    $scope.$on("NavigateTolist", function (evt, propData) {
      if(propData?.stepName === 'ADDITIONAL_HUBS'){
        $scope.props = propData;
      }
    });
})
