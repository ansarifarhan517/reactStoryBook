import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const OverallSummary = React.lazy(() => import(/* webpackChunkName: "OverallSummaryEntry" */'./OverallSummary'));

function OverallSummaryLazy(props){
    return (
        <div>
          <Suspense fallback={
            <Position type='relative'>
              <Loader center fullScreen />
            </Position>}>
            <OverallSummary {...props} />
          </Suspense>
        </div>
      );
}

angular.module('analytics').value('OverallSummary', OverallSummaryLazy);

angular.module('analytics').controller('OverallSummaryCtrl', function($rootScope) {
    $rootScope.menuActive = 'report'
})