import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const CheckpointsListView = React.lazy(() => import('./CheckpointsListView'));

function CheckpointsLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <CheckpointsListView {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('trips').value('CheckpointsListView', CheckpointsLazy);

angular.module('trips').controller('CheckpointsCtrl', function ($scope, $rootScope,$state) {
  $rootScope.currentPageName = 'checkpoints'
  $scope.props = {
    ngStateRouter: {...$state}
  }
})