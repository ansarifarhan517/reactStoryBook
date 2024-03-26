import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const TripPlanningSchedulerListView = React.lazy(() => import(/* webpackChunkName: "TripPlanningSchedulerListView" */ './PlanningListView'));

function TripPlanningSchedulerListViewLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <TripPlanningSchedulerListView />
      </Suspense>
    </div>
  );
}
angular.module('planning').value('TripPlanningSchedulerListView', TripPlanningSchedulerListViewLazy);
angular.module('planning').controller('tripPlaningSchedulerListViewCtrl', function ($rootScope) {
 $rootScope.menuActive = 'Routes';
})