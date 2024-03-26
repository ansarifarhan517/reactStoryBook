import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const DeviationReports = React.lazy(() => import('./DeviationReports'));

function DeviationReportsLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <DeviationReports {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('reports').value('DeviationReports', DeviationReportsLazy);

angular.module('reports').controller('DeviationReportsCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'reports';
})