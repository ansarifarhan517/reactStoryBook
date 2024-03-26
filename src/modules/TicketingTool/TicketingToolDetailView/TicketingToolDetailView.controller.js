import { func } from 'prop-types';

import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

// import TicketingToolListView from './TicketingToolListView'

const TicketingToolDetailView = React.lazy(() => import(/* webpackChunkName: "TicketingToolDetailView" */ './TicketingToolDetailView'));

function TicketingToolDetailViewLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <TicketingToolDetailView {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('ticketingTool').value('TicketingToolDetailView', TicketingToolDetailViewLazy);

angular.module('ticketingTool').controller('TicketingToolDetailViewCtrl', function ($rootScope,$state,$scope) {
    $scope.props = {
        ngStateRouter: $state,
    }
    $rootScope.menuActive = 'helpCenter';
    $rootScope.title = "Log a ticket"
})