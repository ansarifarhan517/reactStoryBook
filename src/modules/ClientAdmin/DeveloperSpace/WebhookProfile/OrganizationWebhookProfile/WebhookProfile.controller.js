import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const WebhookProfile = React.lazy(() => import('./WebhookProfile'));

function WebhookProfileLazy() {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>}>
                <WebhookProfile />
            </Suspense>
        </div>
    );
}

angular.module('onboarding').value('WebhookProfile', WebhookProfileLazy);

angular.module('onboarding').controller('webhookProfileCtrl', function ($scope, $rootScope) {
})