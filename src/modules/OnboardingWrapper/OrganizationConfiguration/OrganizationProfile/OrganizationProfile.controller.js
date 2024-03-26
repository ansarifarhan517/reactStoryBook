import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const OrganizationProfileEntry = React.lazy(() => import('./OrganizationProfile'));

function OrganizationProfileEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <OrganizationProfileEntry {...props} />
      </Suspense>
    </div>
  );
}



angular.module('onboarding').value('OrganizationProfileEntry', OrganizationProfileEntryLazy);

angular.module('onboarding').controller('OrganizationProfileEntryCtrlReact', function ($scope, $rootScope) {
  $scope.currentPage = "client";
  $scope.props = {
    clientId: $scope.clientId
  }
});