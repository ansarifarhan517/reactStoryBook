import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const TrackersListView = React.lazy(() => import('./TrackersListView'));

function TrackersLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <TrackersListView {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('contract').value('TrackersListView', TrackersLazy);

angular.module('contract').controller('TrackersCtrl', function ($scope, $rootScope,$state) {
  $rootScope.currentPageName = 'trackers'
  $scope.props = {
    ngStateRouter: {...$state}
  }
})