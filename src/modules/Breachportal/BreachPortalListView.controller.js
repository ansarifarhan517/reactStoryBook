import { func } from 'prop-types';

import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const BreachPortalToolListView = React.lazy(() => import(/* webpackChunkName: "TicketingToolListView" */ './BreachPortalToolListView'));

function BreachPortalToolListViewLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <BreachPortalToolListView {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('ticketingTool').value('BreachPortalToolListView', BreachPortalToolListViewLazy);

angular.module('ticketingTool').controller('BreachPortalListViewCtrl', function ($rootScope,$state,$scope) {
    $scope.props = {
        ngStateRouter: $state,
    }
    $rootScope.title = "Breach portal"
})
