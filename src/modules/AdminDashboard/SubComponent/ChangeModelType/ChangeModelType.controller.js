import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const ChangeModelType = React.lazy(() => import('./changeModelType'));

function ChangeModelTypeLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <ChangeModelType/>
        </Suspense>
      </div>
    );
  }

angular.module('admindashboard').value('ChangeModelType', ChangeModelTypeLazy);
angular.module('admindashboard').controller('ChangeModelType', function () {})