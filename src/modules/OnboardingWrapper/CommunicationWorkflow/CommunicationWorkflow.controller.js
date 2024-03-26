import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const CommunicationWorkflow = React.lazy(() => import('./CommunicationWorkflow'));

function CommunicationWorkflowLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <CommunicationWorkflow {...props} />
        </Suspense>
      </div>
    );
  }

angular.module('onboarding').value('CommunicationWorkflow', CommunicationWorkflowLazy);

angular.module('onboarding').controller('CommunicationWorkflowCtrl', function ($scope, $rootScope, $state) {})