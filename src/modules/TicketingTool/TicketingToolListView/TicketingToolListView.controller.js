import { func } from 'prop-types';

import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

// import TicketingToolListView from './TicketingToolListView'

const TicketingToolListView = React.lazy(() => import(/* webpackChunkName: "TicketingToolListView" */ './TicketingToolListView'));

function TicketingToolListViewLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <TicketingToolListView {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('ticketingTool').value('TicketingToolListView', TicketingToolListViewLazy);

angular.module('ticketingTool').controller('TicketingToolListViewCtrl', function ($rootScope,$state,$scope) {
    $scope.props = {
        ngStateRouter: $state,
    }
    $rootScope.menuActive = 'helpCenter';
    $rootScope.title = "Log a ticket"
})