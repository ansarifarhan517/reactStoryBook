import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const ScheduledTripPlanningForm = React.lazy(() => import(/* webpackChunkName: "ScheduledTripPlanningForm" */ './PlanningForm'));

function ScheduledTripPlanningFormLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <ScheduledTripPlanningForm />
      </Suspense>
    </div>
  );
}
angular.module('planning').value('ScheduledTripPlanningForm', ScheduledTripPlanningFormLazy);

angular.module('planning').controller('planningFormCtrl', function ($rootScope) {
  $rootScope.menuActive = 'Trip Planning Schedulers';
})